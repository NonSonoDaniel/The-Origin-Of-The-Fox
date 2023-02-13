const { EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const Economy = require('../../Schema/Economy.js');
const Borsa = require("../../Schema/Borsa.js")
const { Canali } = require('../../config/config.json')


module.exports = {
    data: new SlashCommandBuilder()
    .setName('converti')
    .setDescription('Converti gli euro in Volpicoin e viceversa!')
    .setDMPermission(false)
    .addStringOption(option =>
        option.setName('da')
            .setDescription('Converti da.')
            .setRequired(true)
            .addChoices(
                { name : 'volpicoin', value : 'volpicoin' },
                { name : 'euro', value : 'euro' },
            ))
            .addStringOption(option =>
                option.setName('a')
                    .setDescription('Converti a.')
                    .setRequired(true)
                    .addChoices(
                        { name : 'volpicoin', value : 'volpicoinA' },
                        { name : 'euro', value : 'euroA' },
                    )),

    async run(interaction) {
        const da = interaction.options.getString("da");
        const a = interaction.options.getString("a");

        const match = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setDescription(`**<@${interaction.user.id}> Non puoi convertire la stessa valuta!**`)
        .setColor("Red")
        .setTimestamp();

        if(da === "volpicoin" && a === "volpicoinA") return interaction.reply({ embeds: [match], ephemeral: true });
        if(da === "euro" && a === "euroA") return interaction.reply({ embeds: [match], ephemeral: true });

        const noBanca = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setDescription(`<@${interaction.user.id}> Questo comando può essere eseguito solo in <#${Canali.Banca}>!`)
        .setColor("Red")
        .setTimestamp();
        
        if(interaction.channel.id != Canali.Banca) return interaction.reply({ embeds: [noBanca], ephemeral: true });

        const EconomyDB = await Economy.findOne({ User: interaction.user.id });
        const BorsaDB = await Borsa.findOne({ serverID: interaction.guild.id });

        const noSoldi = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setDescription(`<@${interaction.user.id}> Non hai abbastanza **Euro 💸** per convertirli in VolpiCoin!\n Ti servono almeno **${BorsaDB.valore} 💸** per avere 1 VolpiCoin!`)
        .setColor("Red")
        .setTimestamp();

        if(EconomyDB.Euro < BorsaDB.valore) return interaction.reply({ embeds: [noSoldi], ephemeral: true });

    }
}