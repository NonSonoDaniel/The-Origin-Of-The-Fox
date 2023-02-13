const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { Embed, Canali } = require("../../config/config.json");
const db = require("../../Schema/Economy.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("portafoglio")
    .setDescription("Visualizza il tuo portafoglio!")
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

    const portafoglioDB = await db.findOne({ User: interaction.user.id });
    const embedF = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `<@${interaction.user.id}> Ho creato il tuo portafoglio per il primo utilizzo! Da ora potrai guadagnare gli **Euro** 💸!`
      )
      .setColor("Green")
      .setTimestamp();

    if (!portafoglioDB)
      return (
        await interaction.reply({ embeds: [embedF] }),
        new db({
          User: interaction.user.id,
          Euro: 100,
          VolpiCoin: 0,
          EuroInviati: 0,
          EuroRicevuti: 0,
        })
          .save()
          .then(
            console.log(
              `Ho aggiunto ${interaction.user.tag} al Database dell'Economia!`
            )
          )
      );

    const portafoglio = new EmbedBuilder()
      .setTitle(interaction.user.username)
      .setURL(`https://discord.com/users/${interaction.user.id}`)
      .setDescription(
        `👤 | Profilo utente: <@!${interaction.user.id}>\n<:Volpicoin:1074419328599998484> | VolpiCoin: **${portafoglioDB.VolpiCoin}**\n💸 | Euro: **${portafoglioDB.Euro}**\n📨 | Euro Inviati: **${portafoglioDB.EuroInviati}**\n📩 | Euro Ricevuti: **${portafoglioDB.EuroRicevuti}**`
      )
      .setColor(Embed.ColoreT)
      .setTimestamp();
    interaction.reply({ embeds: [portafoglio] });
  },
};
