const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits} = require("discord.js")
const { Canali, Ruoli } = require('../../config/config.json');
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
    const borsa = await borsaDB.findOne({ serverID: interaction.guild.id })
    if(borsa) return borsaDB.updateOne({ serverID: interaction.guild.id }, {$set:{valore: valore, staffID: interaction.user.username}}).then(async () => {
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
        return await interaction.channel.send({ content: `@here`, embeds: [successoC] })

    })
        
    
    new borsaDB({
        staffID: interaction.user.username,
        serverID: interaction.guild.id,
        valore: valore
    }).save().then(async () => {
        const successo = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
        .setColor("Green")
        .setDescription(`Ho impostato correttamente il valore della borsa a **${valore}** euro 💸!`)
        .setTimestamp()
        await interaction.reply({ embeds: [successo], ephemeral: true })
        await interaction.channel.send({ content: `Hey ${Ruoli.NewsBorsa}!\nIl valore di mercato dei **Volpicoin** <:Volpicoin:1074419328599998484> è stato cambiato!\nOra *1 Volpicoin* vale **${valore} euro**! :money_with_wings:\nSbrigati a fare le tue transazioni! :bar_chart:` })
        }) 
    }
}