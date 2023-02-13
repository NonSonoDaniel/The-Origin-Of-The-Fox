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
                    ))
                    .addNumberOption((option) =>
                    option
                      .setName("quantità")
                      .setDescription("La quantità di Euro/volpicoin da convertire.")
                      .setRequired(true)
                  ),

    async run(interaction) {
        const da = interaction.options.getString("da");
        const a = interaction.options.getString("a");
        const quantità = interaction.options.getNumber("quantità")

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

        
        if(da == "volpicoin" && a == "euroA") {
            const BorsaDB = await Borsa.findOne({ serverID: interaction.guild.id });
            const EconomyDB = await Economy.findOne({ User: interaction.user.id });
            const noVolp1 = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setDescription(`<@${interaction.user.id}> Non hai abbastanza **Volpicoin <:Volpicoin:1074419328599998484>** per convertirli in Euro 💸!\n Ti servono ancora  **${quantità - EconomyDB.VolpiCoin} Volpicoin <:Volpicoin:1074419328599998484>** !`)
            .setColor("Red")
            .setTimestamp();
            const sel1 = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setDescription(`<@${interaction.user.id}> Devi inserire almeno **1** nella quantità!`)
            .setColor("Red")
            .setTimestamp();
            const noVolp = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setDescription(`<@${interaction.user.id}> Non hai nessun **VolpiCoin <:Volpicoin:1074419328599998484>**`)
            .setColor("Red")
            .setTimestamp();

            const successo = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setDescription(`<@${interaction.user.id}> Conversione effettuata con successo!\n**<:Volpicoin:1074419328599998484> | Volpicoin:** ${EconomyDB.VolpiCoin} -> ${EconomyDB.VolpiCoin - quantità}\n💸 | **Euro:** ${EconomyDB.Euro} -> ${EconomyDB.Euro + BorsaDB.valore * quantità}`)
            .setColor("Green")
            .setTimestamp();
            if(quantità == 0) return interaction.reply({ embeds: [sel1], ephemeral: true });

            if(quantità > EconomyDB.VolpiCoin) return interaction.reply({ embeds: [noVolp1], ephemeral: true });

            if(EconomyDB.VolpiCoin == 0) return interaction.reply({ embeds: [noVolp], ephemeral: true });

            await Economy.updateOne({ User: interaction.user.id }, {$set:{VolpiCoin: EconomyDB.VolpiCoin - quantità, Euro: EconomyDB.Euro + BorsaDB.valore * quantità}});

            return interaction.reply({ embeds: [successo] })


        } else if(da == "euro" && a == "volpicoinA") {
            const BorsaDB = await Borsa.findOne({ serverID: interaction.guild.id });
            const EconomyDB = await Economy.findOne({ User: interaction.user.id });
            const noVolp1 = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setDescription(`<@${interaction.user.id}> Non hai abbastanza **Euro 💸** per convertirli in VolpiCoin <:Volpicoin:1074419328599998484>!\n Ti servono almeno **${BorsaDB.valore} Euro 💸** !`)
            .setColor("Red")
            .setTimestamp();
            const sel1 = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setDescription(`<@${interaction.user.id}> Devi inserire almeno **1** nella quantità!`)
            .setColor("Red")
            .setTimestamp();

            const successo = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setDescription(`<@${interaction.user.id}> Conversione effettuata con successo!\n**<:Volpicoin:1074419328599998484> | Volpicoin:** ${EconomyDB.VolpiCoin} -> ${EconomyDB.VolpiCoin + quantità}\n💸 | **Euro:** ${EconomyDB.Euro} -> ${EconomyDB.Euro - BorsaDB.valore * quantità}`)
            .setColor("Green")
            .setTimestamp();
            if(quantità == 0) return interaction.reply({ embeds: [sel1], ephemeral: true });

            if(quantità > EconomyDB.Euro) return interaction.reply({ embeds: [noVolp1], ephemeral: true });

            await Economy.updateOne({ User: interaction.user.id }, {$set:{VolpiCoin: EconomyDB.VolpiCoin + quantità, Euro: EconomyDB.Euro - BorsaDB.valore * quantità}});

            return interaction.reply({ embeds: [successo] })

        }
    }
}