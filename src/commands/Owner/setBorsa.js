const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits} = require("discord.js")
const { Canali } = require('../../config/config.json');
const borsaDB = require('../../Schema/Borsa.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('set-borsa')
    .setDescription('Imposta il valore della borsa del server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addIntegerOption((option) =>
        option.setName('valore')
            .setDescription('Aggiungi il valore in euro di 1 volpicoin.')
            .setRequired(true)),

async run(interaction) {
    const valore = interaction.options.getInteger("valore");
    const noBanca = new EmbedBuilder()
    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
    .setDescription(`<@${interaction.user.id}> Questo comando può essere eseguito solo in <#${Canali.Borsa}>!`)
    .setColor("Red")
    .setTimestamp();
    
    if(interaction.channel.id != Canali.Borsa) return interaction.reply({ embeds: [noBanca], ephemeral: true });

    new borsaDB({
        staffID: interaction.user.id,
        valore: valore
    }).save().then(async () => {
        const successo = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
        .setColor("Green")
        .setDescription(`Ho impostato correttamente il valore della borsa a **${valore}** euro 💸!`)
        .setTimestamp()
        const successoC = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
        .setColor("Green")
        .setDescription(`Salve utenti! Il valore della borsa è cambiato!\n Ora **1 volpicoin** equivale a **${valore}**💸!`)
        .setTimestamp()
        await interaction.reply({ embeds: [successo], ephemeral: true })
        await interaction.channel.send({ content: `@here`, embeds: [successoC] })
        }) 
    }
}