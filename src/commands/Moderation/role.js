const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { Embed } = require('../../config/config.json')
const buttonMonthOptions = [
    { customId: 'si', value: '✅' },
    { customId: 'no', value: '<:cz_cross:590234470221742146>' }
];

module.exports = {
    data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Add/remove a role to a user!')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addStringOption(option =>
        option.setName('azione')
            .setDescription('Azione da eseguire.')
            .setRequired(true)
            .addChoices(
                { name : 'aggiungi', value : 'add' },
                { name : 'rimuovi', value : 'rem' },
            ))
        .addRoleOption(option =>
            option.setName('ruolo')
            .setDescription('Ruolo.')
            .setRequired(true))
        .addUserOption(option => 
            option.setName('utente')
            .setDescription('Seleziona l\'utente.')
            .setRequired(true)),

async run(interaction) {
    try{

    let utente = interaction.options.getMember('utente');
    let azione = interaction.options.getString('azione');
    let ruolo = interaction.options.getRole('ruolo');
    
    if(azione == 'add') {
        const errh = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`**Non puoi aggiungere/rimuovere ruoli superiori al tuo o appartenenti a BOT!**`)
        .setColor(Embed.ColoreLog);
    
        if(interaction.member.roles.highest.position <= ruolo.position) {
            return interaction.reply({ embeds: [errh], ephemeral: true})
        };

       const errhas = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`**<@${utente.id}> ha già il ruolo ${ruolo}!**`)
        .setColor(Embed.ColoreLog);

        if(utente.roles.cache.has(ruolo)) {
            return interaction.reply({ embeds: [errhas], ephemeral: true });
        };

        let row_first = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('si')
            .setLabel('Conferma')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId('no')
            .setLabel('Annulla')
            .setEmoji('<:cz_cross:590234470221742146>')
            .setStyle(ButtonStyle.Danger)
            ); 

            let updated_row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('updated_si')
                .setLabel('Conferma')
                .setEmoji('✅')
                .setDisabled()
                .setStyle(ButtonStyle.Success)
                )
                .addComponents(
                new ButtonBuilder()
                .setCustomId('updated_no')
                 .setLabel('Annulla')
                 .setEmoji('<:cz_cross:590234470221742146>')
                 .setDisabled()
                 .setStyle(ButtonStyle.Danger)  
                )

            const safe = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`*Confermi l'aggiunta del ruolo ${ruolo} a <@${utente.id}>?*`)
            .setColor(Embed.ColoreLog)

    let msgInit = await interaction.reply({ embeds: [safe], components: [row_first], fetchReply: true, ephemeral: true })   
    let filter = button => ['si', 'no'].includes(button.customId) && button.user.id === interaction.user.id;  
    let collector = await msgInit.awaitMessageComponent({ filter: filter, componentType: ComponentType.Button});
    let { value } = buttonMonthOptions.find(button => button.customId === collector.customId);

    if(value == '✅') {
        const EmbedMsg = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setDescription(`Il ruolo ${ruolo} è stato correttamente aggiunto a <@${utente.id}>`)
        .setColor("Green")
        .setTimestamp()
        await utente.roles.add(ruolo)
        await collector.update({ components: [updated_row] });
        interaction.editReply({ embeds: [EmbedMsg], ephemeral: true })        

    } else {
        const clearAnnullaled = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setColor("Red")
        .setDescription(`*Il ruolo non è stato aggiunto!*`)
        .setTimestamp();
        await collector.update({ components: [updated_row] });
        return interaction.editReply({embeds: [clearAnnullaled], ephemeral: true});
    }}

   else if(azione == 'rem') {

        let row_first = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('si')
            .setLabel('Conferma')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId('no')
            .setLabel('Annulla')
            .setEmoji('<:cz_cross:590234470221742146>')
            .setStyle(ButtonStyle.Danger)
            ); 

            let updated_row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('updated_si')
                .setLabel('Conferma')
                .setEmoji('✅')
                .setDisabled()
                .setStyle(ButtonStyle.Success)
                )
                .addComponents(
                new ButtonBuilder()
                .setCustomId('updated_no')
                 .setLabel('Annulla')
                 .setEmoji('<:cz_cross:590234470221742146>')
                 .setDisabled()
                 .setStyle(ButtonStyle.Danger)  
                )


        const EmbedConferma = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setDescription(`*Confermi la rimozione del ruolo ${ruolo} a <@${utente.id}>?*`)
        .setColor(Embed.ColoreLog)
        .setTimestamp()
            
            let msgInit1 = await interaction.reply({ embeds: [EmbedConferma], components: [row_first], fetchReply: true, ephemeral: true })
            const filter = button => ['si', 'no'].includes(button.customId) && button.user.id === interaction.user.id;  
            const collector = await msgInit1.awaitMessageComponent({ filter: filter, componentType: ComponentType.Button });
            const { value } = buttonMonthOptions.find(button => button.customId === collector.customId);
                        
                        if (value === '✅') {
                            const EmbedMsg = new EmbedBuilder()
                            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                            .setDescription(`*Hai correttamente rimosso il ruolo ${ruolo} a <@${utente.id}>!*`)
                            .setColor("Green")
                            .setTimestamp()
                            await utente.roles.remove(ruolo)
                            await collector.update({ components: [updated_row] });
                            interaction.editReply({ embeds: [EmbedMsg], ephemeral: true })
                            } else {
                                const clearAnnullaled = new EmbedBuilder()
                                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                                .setColor("Red")
                                .setDescription(`*Il ruolo non è stato rimosso!*`)
                                .setTimestamp();
                                await collector.update({ components: [updated_row] });
                                return interaction.editReply({embeds: [clearAnnullaled], ephemeral: true});
                            }
                        }
                    } catch (err) {
                            const errore = new EmbedBuilder()
                            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`An error has occurred, please try again! ❌`)
                            .setTimestamp();
                            console.error(err)
                                return interaction.reply({ embeds: [errore], ephemeral: true});
                        }
                }
                    
    }