const { Client, EmbedBuilder } = require('discord.js');
const { Data, Embed, Canali } = require("../config/config.json");

/**
 * @param {Client} client
 */

module.exports = (client) => {


client.on('voiceStateUpdate', function(oldState, newState) {
        const guild = client.guilds.cache.get(Data.guildID);
        const logCh = guild.channels.cache.get(Canali.Logs.voice);

        if(oldState.member.user.bot) return;
        if(newState.channelId !== null && oldState.channelId !== null) {
            if(oldState.channelId !== newState.channelId) {
                const voice = new EmbedBuilder()
                .setAuthor({ name: oldState.member.user.username, iconURL: oldState.member.user.displayAvatarURL({ dynamic: true })})
                .setColor(Embed.ColoreLog)
                .setDescription(`<@${oldState.member.id}> si è spostato dal canale <#${oldState.channelId}> al <#${newState.channelId}>`)
                .setTimestamp()
                logCh.send({ embeds: [voice] })
            }
        }
        else if(oldState.channelId === null) {

            const voice = new EmbedBuilder()
            .setAuthor({ name: oldState.member.user.username, iconURL: oldState.member.user.displayAvatarURL({ dynamic: true })})
            .setColor("Green")
            .setDescription(`<@${newState.member.id}> è entrato nel canale <#${newState.channelId}>`)
            .setTimestamp()
            logCh.send({ embeds: [voice] })

        }
        else if(newState.channelId === null) {

            const voice = new EmbedBuilder()
            .setAuthor({ name: oldState.member.user.username, iconURL: oldState.member.user.displayAvatarURL({ dynamic: true })})
            .setColor("Red")
            .setDescription(`<@${newState.member.id}> è uscito dal canale <#${oldState.channelId}>`)
            .setTimestamp()
            logCh.send({ embeds: [voice] })

            }
        })
}