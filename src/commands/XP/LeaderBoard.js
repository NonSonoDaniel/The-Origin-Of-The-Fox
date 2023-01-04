const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const levelDB = require("../../Schema/XP.js");
const { Embed, Canali } = require("../../config/config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xp_classifica")
    .setDescription("Visualizza la classifica XP di VolpiStan.")
    .setDMPermission(false),
  async run(interaction) {
    const { guild } = interaction;

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

    let text = "";

    const Data = await levelDB
      .find({ ServerID: guild.id })
      .sort({
        Prestigio: -1,
        XPT: -1,
        XP: -1,
        Livello: -1,
      })
      .limit(10)
      .catch((err) => {});

    await interaction.deferReply();

    for (let counter = 0; counter < Data.length; ++counter) {
      const { User, Prestigio, XPT, XP, Livello } = Data[counter];

      const Member = guild.members.cache.get(User);

      let MemberTag;

      if (Member) MemberTag = Member.user.tag;
      else MemberTag = "Namertag non conosciuto.";

      let ShortXp = shorten(XP);
      let ShortXpT = shorten(XPT);

      text += `${
        counter + 1
      }. **${MemberTag}**:\n Prestigio: **${Prestigio}** | XPT: **${ShortXpT}** | XP: **${ShortXp}** | Livello: **${Livello}**\n\n`;
    }
    const classifica = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setColor(Embed.ColoreT)
      .setDescription(`${text}`);

    interaction.editReply({ embeds: [classifica] });
  },
};

function shorten(count) {
  const AB = ["", "k", "M", "T"];

  const i = 0 === count ? count : Math.floor(Math.log(count) / Math.log(1000));

  let result = parseFloat((count / Math.pow(1000, i)).toFixed(2));
  result += `${AB[i]}`;

  return result;
}
