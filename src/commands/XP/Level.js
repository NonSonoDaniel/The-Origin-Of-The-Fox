const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const levelDB = require("../../Schema/XP.js");
const { Embed, Canali } = require("../../config/config.json");
const Canvacord = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xp_level")
    .setDescription("Visualizza il tuo livello.")
    .setDMPermission(false),
  async run(interaction) {
    const { user, guild } = interaction;

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

    if (interaction.channel.id != Canali.Commands) return interaction.reply({ embeds: [noBanca], ephemeral: true });

    const member = guild.members.cache.get(user.id);

    const Data = await levelDB.findOne({ User: user.id }).catch((err) => {});
    const noXP = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(`<@${user.id}> Non hai accumulato nessun XP!`)
      .setColor("Red")
      .setTimestamp();
    if (!Data) return interaction.reply({ embeds: [noXP], ephemeral: true });

    await interaction.deferReply();

    const Required = Data.Livello * Data.Livello * 100 + 100;

    
    const level = new Canvacord.Rank()
    .setAvatar(member.displayAvatarURL({ forceStatic: true }))
    .setBackground(
        "IMAGE",
        "https://cdn.discordapp.com/attachments/787356318100619275/1074383921577463938/sfondo_XP_level.png"
        )
        .setCurrentXP(Data.XP)
        .setRequiredXP(Required)
        .setRank(1, "Rank", false)
        .setLevel(Data.Livello, "Livello")
      .setProgressBar("#ffb500", "COLOR")
      .setUsername(member.user.username)
      .setDiscriminator(member.user.discriminator);
      
      const Card = await level.build().catch((err) => console.log(err));
      
      const attachment = new AttachmentBuilder(Card, { name: "level.png" });
      
      const embed = new EmbedBuilder()
      .setColor(Embed.ColoreT)
      .setTitle(`Rank Card di ${member.user.username}`)
      .setDescription(`XP accumulato totale: **${Data.XPT}**\nLivello Prestigio: **${Data.Prestigio}**`)
      .setImage("attachment://level.png");

      const EmbedPrestigio = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("Gold")
      .setDescription(`<@${user.id}> Congratulazioni! Livello **${Data.Livello}** raggiunto!\n\n**💫 Prestigio Disponibile!**\nDigita **/prestigio** per prestigiarti!`)
      .setFooter({ text: "N.B Una volta raggiunto il livello 100, se non si prestigia, non si guadagnerà più XP e VolpiCoin!" })
      .setImage("attachment://level.png");
    
      if(Data.Livello === 100) return interaction.editReply({ embeds: [EmbedPrestigio], files: [attachment] });
      
      interaction.editReply({ embeds: [embed], files: [attachment] });
    },
  };
  