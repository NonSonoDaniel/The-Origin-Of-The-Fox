const { Client, EmbedBuilder } = require('discord.js');
const { Data, Embed, Canali } = require("../config/config.json");

/**
 * @param {Client} client
 */

module.exports = (client) => {


client.on("guildUpdate", async function(oldGuild, newGuild) {
        const guild = client.guilds.cache.get(Data.guildID);
        const logCh = guild.channels.cache.get(Canali.Logs.voice);
        			// Guild name 
			if (oldGuild.name != newGuild.name) {
				const embed = new EmbedBuilder()
					.setDescription('**Nome del server modificato!**')
                    .setColor(Embed.ColoreLog)
					.setAuthor({ name: newGuild.name, iconURL: newGuild.iconURL() })
					.addFields({ name: 'Prima:', value: oldGuild.name })
					.addFields({ name: 'Dopo:', value: newGuild.name })
					.setTimestamp();
				logCh.send({ embeds: [embed] })
			}

			// Server's boost level 
			if (oldGuild.premiumTier != newGuild.premiumTier) {
				const embed = new EmbedBuilder()
					.setDescription(`**Server boost ${oldGuild.premiumTier < newGuild.premiumTier ? 'Aumentato' : 'Diminuito'}**`)
					.setAuthor({ name: newGuild.name, iconURL: newGuild.iconURL() })
					.addFields({ name: 'Prima:', value: oldGuild.premiumTier })
					.addFields({ name: 'Dopo:', value: newGuild.premiumTier })
					.setTimestamp();
				logCh.send({ embeds: [embed] })
			}

			// Server new banner
			if (!oldGuild.banner && newGuild.banner) {
				const embed = new EmbedBuilder()
					.setDescription('**Server banner modificato!**')
					.setAuthor({ name: newGuild.name, iconURL: newGuild.iconURL() })
					.addFields({ name: 'Prima:', value: oldGuild.banner })
					.addFields({ name: 'Dopo:', value: newGuild.banner })
					.setTimestamp();
				logCh.send({ embeds: [embed] })
			}

			// Server AFK channel
			if (!oldGuild.afkChannel && newGuild.afkChannel) {
				const embed = new EmbedBuilder()
					.setDescription('**Server AFK channel modificato!**')
					.setAuthor({ name: newGuild.name, iconURL: newGuild.iconURL() })
					.addFields({ name: 'Prima:', value: oldGuild.afkChannel })
					.addFields({ name: 'Dopo:', value: newGuild.afkChannel })
					.setTimestamp();
				logCh.send({ embeds: [embed] })
			}

			// Server vanity URL
			if (!oldGuild.vanityURLCode && newGuild.vanityURLCode) {
				const embed = new EmbedBuilder()
					.setDescription('**Server Vanity URL modificato!**')
					.setAuthor({ name: newGuild.name, iconURL: newGuild.iconURL() })
					.addFields({ name: 'Prima:', value: oldGuild.vanityURLCode })
					.addFields({ name: 'Dopo:', value: newGuild.vanityURLCode })
					.setTimestamp();
				logCh.send({ embeds: [embed] })
			}
    });
}