const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const { Embed, Ruoli } = require('../../config/config.json')
const db = require('../../Schema/BlackList.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('blacklist')
		.setDescription('Aggiunge/rimuove un utenet dalla Black List.')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false)
        .addStringOption(option =>
            option.setName('azione')
                .setDescription('Azione da eseguire.')
                .setRequired(true)
                .addChoices(
                    { name : 'aggiungi', value : 'add' },
                    { name : 'rimuovi', value : 'rem' },
                ))
		.addUserOption((option) =>
			option.setName('utente')
				.setDescription('Selezionare L\'utente.')
				.setRequired(true))
		.addStringOption((option) =>
			option.setName('reason')
				.setDescription('Specificare la motivazione.')
				.setRequired(false)),
            async run(interaction) {
                const utente = interaction.options.getMember('utente');
                const reason = interaction.options.getString('reason') || "Nessuna motivazione fornita.";
                const azione = interaction.options.getString('azione');

                if(azione === 'add') {
                    const utenteDB = await db.findOne({ userID: utente.id });
                    const userRoles = utente.roles.cache.filter((roles) => roles.id).map((role) => role.id)
                    //console.log(userRoles)

                    const self = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
                    .setColor(Embed.ColoreLog)
                    .setDescription("Non puoi eseguire questo comando su te stesso!")
                    .setTimestamp()
                    if(interaction.user.id === utente.id) return interaction.reply({ embeds: [self], ephemeral: true });

                    const userPresente = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
                    .setColor(Embed.ColoreLog)
                    .setDescription("L'utente è già presente nella **Black Zone**!")
                    .setTimestamp()

                    if(utenteDB) return interaction.reply({ embeds: [userPresente], ephemeral: true });
                    
                    new db({
                        userID: utente.id,
                        staffID: interaction.user.id,
                        reason: reason,
                        roles: [userRoles]
                        
                    }).save().then(async () => {
                        
                        const successo = new EmbedBuilder()
                        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
                        .setColor("Green")
                        .setDescription(`Ho aggiunto correttamente <@${utente.id}> alla **BlackList**!`)
                        .setTimestamp()
                        
                        await (utente.roles.remove(userRoles));
                        await utente.roles.add(Ruoli.BlackZone);
                        await interaction.reply({ embeds: [successo] })

                    });


                } 
                else if (azione === 'rem') {
                const utenteDB = await db.findOne({ userID: utente.id });

                const userPresente = new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
                .setColor(Embed.ColoreLog)
                .setDescription("L'utente non è presente nella **BlackList**!")
                .setTimestamp()

                if(!utenteDB) return interaction.reply({ embeds: [userPresente], ephemeral: true });
                
                    for(let roles of utenteDB.roles) {
                        await interaction.guild.members.cache.get(utenteDB.userID).roles.add(roles)
                    }
                    await db.deleteOne({ userID: utente.id })

                    const successo = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
                    .setColor("Green")
                    .setDescription(`Ho rimosso correttamente <@${utente.id}> dalla **BlackList**!`)
                    .setTimestamp()

                    return interaction.reply({ embeds: [successo] })
                }



            }
        }