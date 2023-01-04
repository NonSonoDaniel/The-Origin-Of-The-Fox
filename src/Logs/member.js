const { Client, EmbedBuilder } = require('discord.js');
const { Data, Canali, Embed } = require('../config/config.json');

/**
 * @param {Client} client
 */

module.exports = (client) => {

    client.on('guildMemberUpdate', (oldMember, newMember) => {
        const guild = client.guilds.cache.get(Data.guildID);
        const logCh = guild.channels.cache.get(Canali.Logs.member);
        
        //Nickname cambiato
    if (oldMember.nickname != newMember.nickname) {
        const embed = new EmbedBuilder()
            .setDescription(`**${newMember.toString()} nickname modificato!**`)
            .setFooter({ text: `ID: ${newMember.id}` })
            .setColor(Embed.ColoreLog)
            .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL() })
            .addFields(
                { name: 'Prima:', value: `${oldMember.nickname || '*Nessuno*'}`, inline: true },
                { name: 'Dopo:', value: `${newMember.nickname || '*Nessuno*'}`, inline: true })
            .setTimestamp();
            
            logCh.send({ embeds: [embed] });

        };
    //Boost server
    if (!oldMember.premiumSince && newMember.premiumSince) {
            const embed = new EmbedBuilder()
            .setColor(Embed.ColoreLog)
                .setDescription(`**${newMember.toString()} Ha boostato il server**`)
                .setFooter({ text: `ID: ${newMember.id}` })
                .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL() })
                .setTimestamp();
                logCh.send({ embeds: [embed] });
        };

        const rolesAdded = newMember.roles.cache.filter(x => !oldMember.roles.cache.get(x.id));
			const rolesRemoved = oldMember.roles.cache.filter(x => !newMember.roles.cache.get(x.id));
			if (rolesAdded.size != 0 || rolesRemoved.size != 0) {
				const roleAddedString = [];
				for (const role of [...rolesAdded.values()]) {
					roleAddedString.push(role.toString());
				}
				const roleRemovedString = [];
				for (const role of [...rolesRemoved.values()]) {
					roleRemovedString.push(role.toString());
				}
				const embed = new EmbedBuilder()
					.setDescription(`**<@${newMember.id}> Ruoli modificati!**`)
                    .setColor(Embed.ColoreLog)
					.setFooter({ text: `ID: ${newMember.id}` })
					.setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL() })
					.addFields(
						{ name: `Ruoli aggiunti [${rolesAdded.size}]:`, value: `${roleAddedString.length == 0 ? '*Nessuno*' : roleAddedString.join('\n ')}`, inline: true },
						{ name: `Ruoli rimossi [${rolesRemoved.size}]:`, value: `${roleRemovedString.length == 0 ? '*Nessuno*' : roleRemovedString.join('\n ')}`, inline: true })
					.setTimestamp();
                    logCh.send({ embeds: [embed] });
			}

    })
};