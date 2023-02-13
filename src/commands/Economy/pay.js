const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { Embed, Canali } = require("../../config/config.json");
const db = require("../../Schema/Economy.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Invia una somma di Euro ad un utente")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("utente")
        .setDescription("Seleziona l'utente.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("euro")
        .setDescription("La quantità di Euro da inviare.")
        .setRequired(true)
    ),
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

    if (interaction.channel.id != Canali.Banca)
      return interaction.reply({ embeds: [noBanca], ephemeral: true });

    const utente = interaction.options.getUser("utente");

    const euro = interaction.options.getInteger("euro");

    const ricevente = await db.findOne({ User: utente.id });

    const pagante = await db.findOne({ User: interaction.user.id });

    const embedA = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `<@${interaction.user.id}> Non puoi effettuare questo comando su te stesso!`
      )
      .setColor("Red")
      .setTimestamp();

    if (interaction.user.id == utente.id)

      return interaction.reply({ embeds: [embedA], ephemeral: true });

    const embedB = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `<@${interaction.user.id}> L\'utente non ha mai creato il portafoglio!`
      )
      .setColor("Red")
      .setTimestamp();

    if (!ricevente)

      return interaction.reply({ embeds: [embedB], ephemeral: true });

    const embedC = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `<@${interaction.user.id}> Non hai mai creato il portafoglio!\nCrealo digitando **/portafoglio**!`
      )
      .setColor("Red")
      .setTimestamp();

    if (!pagante)

      return interaction.reply({ embeds: [embedC], ephemeral: true });

    const embedD = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `<@${interaction.user.id}> Non puoi spedire meno di **50 euro 💸**!`
      )
      .setColor("Red")
      .setTimestamp();

    if (euro < 1)

      return interaction.reply({ embeds: [embedD], ephemeral: true });
    const embedE = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `<@${interaction.user.id}> Non hai abbastanza **Euro 💸**!`
      )
      .setColor("Red")
      .setTimestamp();

    if (euro > pagante.Euro)

      return interaction.reply({ embeds: [embedE], ephemeral: true });

    await db.updateOne(
      { User: utente.id },
      {
        $set: {
          euro: ricevente.Euro + euro,
          euroRicevuti: ricevente.EuroRicevuti + euro,
        },
      }
    );
    await db.updateOne(
      { User: interaction.user.id },
      {
        $set: {
          euro: pagante.Euro - euro,
          euroInviati: pagante.EuroInviati + euro,
        },
      }
    );
    const embed = new EmbedBuilder()
      .setTitle(interaction.user.username)
      .setURL(`https://discord.com/users/${interaction.user.id}`)
      .setDescription("**Pagamento euro 💸**")
      .setColor(Embed.ColoreT)
      .addFields(
        {
          name: `**Pagante: ${interaction.user.tag}**`,
          value: `**euro**:  *${pagante.Euro}* => *${
            pagante.Euro - euro
          }*`,
        },
        {
          name: `**Ricevente: ${utente.tag}**`,
          value: `**euro**:  *${ricevente.Euro}* => *${
            ricevente.Euro + euro
          }*`,
        }
      )
      .setTimestamp();
    interaction.reply({ embeds: [embed] });
  },
};
