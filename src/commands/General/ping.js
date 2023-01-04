const { EmbedBuilder, SlashCommandBuilder, Client, CommandInteraction} = require('discord.js');
const { Embed } = require('../../config/config.json')

/**
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Visualizza il ping del bot!')
    .setDMPermission(false),

    async run(interaction, client) {
        const PingEmbed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`:ping_pong:〢**Pong!** (**ms: ${client.ws.ping}**)`)
        .setColor(Embed.ColoreDefault)
        .setTimestamp()
        await interaction.reply({ embeds: [PingEmbed] }).catch(() => {

            console.log(error)
            return interaction.reply({ content: "**Si è verificato un errore! Se persiste, si prega di segnalarlo allo staff. ❌**", ephemeral: true });

        });
    },
};