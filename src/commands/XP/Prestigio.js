const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { Embed, Canali, Ruoli } = require("../../config/config.json");
const levelDB = require("../../Schema/XP.js");
const economyDB = require("../../Schema/Economy.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xp_prestigio")
    .setDescription("Ottieni il prestigio!")
    .setDMPermission(false),
  async run(interaction) {
    const noBanca = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `<@${interaction.user.id}> Questo comando può essere eseguito solo in <#${Canali.Commands}>!`
      )
      .setColor("Red")
      .setTimestamp();

    if (interaction.channel.id != Canali.Commands)
      return interaction.reply({ embeds: [noBanca], ephemeral: true });

    const dataLDB = await levelDB.findOne({ User: interaction.user.id });
    const dataEDB = await economyDB.findOne({ User: interaction.user.id });

    const no100 = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `<@${interaction.user.id}> Il prestigio può essere effettuato solo quando si è arrivati al **livello 100**!\nPer visualizzare il tuo livello digita **/xp_level**!`
      )
      .setColor("Red")
      .setTimestamp();

    if (!dataLDB || dataLDB.Livello != 100)
      return interaction.reply({ embeds: [no100], ephemeral: false });

    await interaction.deferReply();

    if (dataLDB) {
      const prestigio = dataLDB.Prestigio
      await levelDB.updateOne({ User: interaction.user.id }, {$set: {XP: 0, Livello: 0, Prestigio: prestigio + 1} });

      const successo = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `<@${interaction.user.id}> Prestigio effettuato!\n Ti sono stati accreditati 10000 Euro 💸 e un ruolo speciale come ricompensa!`
      )
      .setColor(Embed.ColoreT)
      .setTimestamp();
      const utente = interaction.guild.members.cache.get(interaction.user.id)
      await utente.roles.add(Ruoli.XP.Prestigio)
      await utente.roles.remove(Ruoli.XP.Novellino)
      await utente.roles.remove(Ruoli.XP.Chiaccherone)
      await utente.roles.remove(Ruoli.XP.Giovanechiaccherone)
      await utente.roles.remove(Ruoli.XP.ChiaccheronePRO)
      await utente.roles.remove(Ruoli.XP.ParlatoreProfessionista)
      await utente.roles.remove(Ruoli.XP.Speaker)
      await interaction.editReply({ embeds: [successo], ephemeral: true });
    };

    if (dataEDB) {

      if(!dataEDB) return;
      const euro = dataEDB.Euro

      await economyDB.updateOne({ User: interaction.user.id }, {$set: { Euro: euro + 10000 }});

    }
  },
};
