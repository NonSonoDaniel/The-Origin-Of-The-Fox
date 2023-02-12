const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../Schema/VoicePrivate.js');
const { Embed, Canali } = require("../../config/config.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-voice")
    .setDescription("Aggiunge un utente nel database dei Canali Privati.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addStringOption(option =>
        option.setName('azione')
            .setDescription('Azione da eseguire.')
            .setRequired(true)
            .addChoices(
                { name : 'aggiungi', value : 'add' },
                { name : 'rimuovi', value : 'rem' },
            ))
    .addUserOption(option => 
        option.setName('utente')
        .setDescription("Seleziona l'utente.")
        .setRequired(true))
        .addChannelOption(option => 
            option.setName('canale')
            .setDescription("Seleziona il canale privato.")
            .setRequired(true))
            .addRoleOption(option => 
                option.setName('ruolo')
                .setDescription("Seleziona il ruolo del canale privato.")
                .setRequired(true)),

    async run(interaction) {
    const user = interaction.options.getMember("utente")
    const canale = interaction.options.getChannel("canale")
    const ruolo = interaction.options.getRole("ruolo")
    let azione = interaction.options.getString('azione');

    //if(!interaction.user.id !== [Redacted.Daniel, Redacted.Tommaso] ) return interaction.reply({ content: `Questo comando è eseguibile solo da <@${Redacted.Daniel}> & <@${Redacted.Tommaso}> [**Ω**REDACTED**Ω**]`, ephemeral: true})

    const noBanca = new EmbedBuilder()
    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
    .setDescription(`<@${interaction.user.id}> Questo comando può essere eseguito solo in <#${Canali.Commands}>!`)
    .setColor("Red")
    .setTimestamp();

    if(interaction.channel.id != Canali.Commands) return interaction.reply({ embeds: [noBanca], ephemeral: true });

    if(azione === 'add') {

    const utente = await db.findOne({ userID: user.id });

    const userPresente = new EmbedBuilder()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
    .setColor(Embed.ColoreLog)
    .setDescription("L'utente è già presente nel **Database dei canali privati**!")
    .setTimestamp()

    if(utente) return interaction.reply({ embeds: [userPresente], ephemeral: true });

    new db({

        userID: user.id,
        channelID: canale.id,
        roleID: ruolo.id

    }).save().then(async () => {
        const successo = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
        .setColor("Green")
        .setDescription(`Ho aggiunto correttamente <@${user.id}> al **Database dei canali privati**!`)
        .setTimestamp()
        await interaction.reply({ embeds: [successo] })
        }) 

    } else if(azione === 'rem') {

        const noUser = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
        .setColor(Embed.ColoreLog)
        .setDescription("L\'utente non è presente nel **Database dei canali privati**!")
        .setTimestamp()
    
        const utente = await db.findOne({ userID: user.id });
        if(!utente) return interaction.reply({ embeds: [noUser], ephemeral: true });

        await utente.deleteOne({ userID: user.id }); 
        const successo = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
        .setColor("Red")
        .setDescription(`Ho eliminato correttamente <@${user.id}> dal **Database dei canali privati**!`)
        .setTimestamp()
        await interaction.reply({ embeds: [successo] })
        
    }

    }
}