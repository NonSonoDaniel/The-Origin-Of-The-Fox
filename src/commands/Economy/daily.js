const { EmbedBuilder, SlashCommandBuilder} = require('discord.js');
const ms = require('ms')
const Economy = require('../../Schema/Economy.js');
const MoneyAction = require('../../Schema/MoneyAction.js')
const { Canali } = require('../../config/config.json')


module.exports = {
    data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Riscatta una somma di VolpiCoin casuale! (1 volta al giorno!)')
    .setDMPermission(false),

    async run(interaction) {

        const noBanca = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `<@${interaction.user.id}> Questo comando può essere eseguito solo in <#${Canali.Banca}>!`
        )
        .setColor("Red")
        .setTimestamp();
    
        if (interaction.channel.id != Canali.Banca) return interaction.reply({ embeds: [noBanca], ephemeral: true });

    const DB = await Economy.findOne({ User: interaction.user.id });
    let ADB = await MoneyAction.findOne({ User: interaction.user.id });

    const noRegistration = new EmbedBuilder()
    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setDescription(`<@${interaction.user.id}> Per eseguire questo comando, devi prima creare il tuo account!\n Digita **/portafoglio**!`)
    .setColor('Red')
    .setTimestamp();
    if(!DB) return interaction.reply({ embeds: [noRegistration], ephemeral: true }); 

        if(!ADB) {
            let timeout = Date.now() + ms("1d");

           ADB = new MoneyAction({
                User: interaction.user.id,
                Daily: timeout
            }).save()

            Collect()

        } else {

            const insuccesso = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`<@${interaction.user.id}> Hai già riscosso il tuo **Daily**, torna tra <t:${parseInt(ADB.Daily / 1000)}:R>!`)
            .setColor('Red')
            .setTimestamp();

            if(ADB.Daily > Date.now()) return interaction.reply({ embeds: [insuccesso] });

            let Timeout = Date.now() + ms("1d")

            ADB.Daily = Timeout
            await ADB.save()

            Collect()
        }

        async function Collect() {

            const Amount = Math.ceil(Math.random() * 2000)

            DB.VolpiCoin += Amount;
            await DB.save()

            const successo = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`<@${interaction.user.id}> Hai riscosso il tuo **Daily** di **${Amount}** VolpiCoin 🦊!`)
            .setColor('Green')
            .setFooter({ text: "Il numero di VolpiCoin che si possono ottenere è randomico!" })
            .setTimestamp();

           return interaction.reply({ embeds: [successo] })
        }
    }
}