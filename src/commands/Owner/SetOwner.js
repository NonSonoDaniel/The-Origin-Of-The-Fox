const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../schema/Owner.js');
const { Embed } = require("../../config/config.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-owner")
    .setDescription("Aggiunge un utente ai privilegi da Owner.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addStringOption(option =>
        option.setName('azione')
            .setDescription('Azione da eseguire.')
            .setRequired(true)
            .addChoices(
                { name : 'add', value : 'add' },
                { name : 'remove', value : 'rem' },
            ))
    .addUserOption(option => 
        option.setName('utente')
        .setDescription("Seleziona l'utente.")
        .setRequired(true)),
    async run(interaction) {
    const user = interaction.options.getMember("utente")
    let azione = interaction.options.getString('action');
    

    if(azione === 'add') {

    const utente = await db.findOne({ userID: user.id });

    const self = new EmbedBuilder()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
    .setColor(Embed.ColoreLog)
    .setDescription("Non puoi aggiungere te stesso al **Database**!")
    .setTimestamp()
    const userPresente = new EmbedBuilder()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
    .setColor(Embed.ColoreLog)
    .setDescription("L'utente è già presente nel **Database**!")
    .setTimestamp()

    if(interaction.user.id === user.id) return interaction.reply({ embeds: [self], ephemeral: true });
    if(utente) return interaction.reply({ embeds: [userPresente], ephemeral: true });

    new db({

        userID: user.id,
        userTAG: user.tag,
        staff: interaction.user.id

    }).save().then(async () => {
        const successo = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
        .setColor("Green")
        .setDescription(`Ho aggiunto correttamente <@${user.id}> al **Database**!\nDi conseguenza, gli sono stati garantiti i privilegi da **Owner**!`)
        .setTimestamp()
        await interaction.reply({ embeds: [successo] })
        }) 

    } else if(azione === 'rem') {
        const self = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
        .setColor(Embed.ColoreLog)
        .setDescription("Non puoi rimuovere te stesso al **Database**!")
        .setTimestamp()

        const noUser = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
        .setColor(Embed.ColoreLog)
        .setDescription("L\'utente non è presente nel **Database**!")
        .setTimestamp()
    
        if(interaction.user.id === user.id) return interaction.reply({ embeds: [self], ephemeral: true });
        const utente = await db.findOne({ userID: user.id });
        if(!utente) return interaction.reply({ embeds: [noUser], ephemeral: true });

        await utente.deleteOne({ userID: user.id }); 
        const successo = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
        .setColor("Red")
        .setDescription(`Ho eliminato correttamente <@${user.id}> al **Database**!\nDi conseguenza, gli sono stati rimossi i privilegi da **Owner**!`)
        .setTimestamp()
        await interaction.reply({ embeds: [successo] })
        
    }

    }
}