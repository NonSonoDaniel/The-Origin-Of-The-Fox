const { Client, EmbedBuilder } = require('discord.js');
const { Data, Canali, Embed } = require("../config/config.json")
const moment = require('moment')

/**
 * @param {Client} client
 */

module.exports = (client) => {

    client.on("channelCreate", function(channel) {
        const guild = client.guilds.cache.get(Data.guildID);
        const LogCh = guild.channels.cache.get(Canali.Logs.channel);
        const channelCreate = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
        .setTitle("**CHANNEL CREATE**")
        .setColor("Green")
        .addFields(
            {
                name: "**Tipologia:**", value: `${channel.type.toString()}`, inline: false
            },
            {
                name: "**Categoria:**", value: `${channel.parent.name}`, inline: false
            },
            {
                name: "**Nome e ID:**", value: `${channel.name} || ${channel.id}`, inline: false
            },
            {
                name: "**Data:**", value: `${moment.utc().format("DD/MM/YYYY hh:mm:ss")}`, inline: false
            },
        )
        LogCh.send({ embeds: [channelCreate] })
    });

    client.on("channelDelete", function(channel) {
        const guild = client.guilds.cache.get(Data.guildID);
        const LogCh = guild.channels.cache.get(Canali.Logs.channel);
        const channelCreate = new EmbedBuilder()
        .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
        .setTitle("**CHANNEL DELETE**")
        .setColor("Red")
        .addFields(
            {
                name: "**Tipologia:**", value: `${channel.type.toString()}`, inline: false
            },
            {
                name: "**Categoria:**", value: `${channel.parent.name}`, inline: false
            },
            {
                name: "**Nome e ID:**", value: `${channel.name} || ${channel.id}`, inline: false
            },
            {
                name: "**Data:**", value: `${moment.utc().format("DD/MM/YYYY hh:mm:ss")}`, inline: false
            },
        )
        LogCh.send({ embeds: [channelCreate] })
    });

    client.on("channelUpdate", function(oldChannel, newChannel) {
        const guild = client.guilds.cache.get(Data.guildID);
        const LogCh = guild.channels.cache.get(Canali.Logs.channel);

        if (oldChannel.name !== newChannel.name) {
            let embed = new EmbedBuilder()
                .setColor(Embed.ColoreLog)
                .setAuthor({ name: `Nome del canale cambiato`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription([
                    `**Canale:**`,
                    ``,
                    `Nome: **${newChannel.name}**`,
                    `Menzione: <#${newChannel.id}>`,
                    `ID: **${newChannel.id}**`
                ].join('\n'))
                .addFields(
                    { name: `Da`, value: `${oldChannel.name}`, inline: true },
                    { name: `A`, value: `${newChannel.name}`, inline: true }
                )
                .setTimestamp()
    
            LogCh.send({ embeds: [embed] })
        }
        if (oldChannel.nsfw !== newChannel.nsfw) {
            let embed = new EmbedBuilder()
                .setColor(Embed.ColoreLog)
                .setAuthor({ name: `Limite di età del canale aggiornato`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription([
                    `**Canale:**`,
                    ``,
                    `Nome: **${newChannel.name}**`,
                    `Menzione: <#${newChannel.id}>`,
                    `ID: **${newChannel.id}**`
                ].join('\n'))
                .addFields(
                    { name: `Vecchia età:`, value: `${oldChannel.nsfw ? 'Abiliatto :white_check_mark:' : 'Disabilitato :x:'}`, inline: true },
                    { name: `Nuova età:`, value: `${newChannel.nsfw ? 'Abiliatto :white_check_mark:' : 'Disabilitato :x:'}`, inline: true }
                )
                .setTimestamp()
    
            LogCh.send({ embeds: [embed] })
        }
        if (oldChannel.parent !== newChannel.parent) {
            let embed = new EmbedBuilder()
                .setColor(Embed.ColoreLog)
                .setAuthor({ name: `Categoria del canale modificata`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription([
                    `**Canale:**`,
                    ``,
                    `Nome: **${newChannel.name}**`,
                    `Menzione: <#${newChannel.id}>`,
                    `ID: **${newChannel.id}**`
                ].join('\n'))
                .addFields(
                    { name: `Da`, value: `${oldChannel.parent}`, inline: true },
                    { name: `A`, value: `${newChannel.parent}`, inline: true }
                )
                .setTimestamp()
    
            LogCh.send({ embeds: [embed] })
        }
        if (oldChannel.topic !== newChannel.topic) {
            let embed = new EmbedBuilder()
                .setColor(Embed.ColoreLog)
                .setAuthor({ name: `Argomento del canale modificato`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription([
                    `**Canale:**`,
                    ``,
                    `Nome: **${newChannel.name}**`,
                    `Menzione: <#${newChannel.id}>`,
                    `ID: **${newChannel.id}**`
                ].join('\n'))
                .addFields(
                    { name: `Da`, value: `${oldChannel.topic || `Nessun argomento :x:`}`, inline: true },
                    { name: `A`, value: `${newChannel.topic || `Nessun argomento :x:`}`, inline: true },
                )
                .setTimestamp()
    
            LogCh.send({ embeds: [embed] })
        }
        if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
            let embed = new EmbedBuilder()
                .setColor(Embed.ColoreLog)
                .setAuthor({ name: `La slowmode del canale è cambiata`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription([
                    `**Canale:**`,
                    ``,
                    `Nome: **${newChannel.name}**`,
                    `Menzione: <#${newChannel.id}>`,
                    `ID: **${newChannel.id}**`
                ].join('\n'))
                .addFields(
                    { name: `Vecchia Slowmode:`, value: `${oldChannel.rateLimitPerUser || 'Slowmode non attiva.'}`, inline: true },
                    { name: `Nuova Slowmode:`, value: `${newChannel.rateLimitPerUser || 'Slowmode non attiva.'}`, inline: true },
                )
                .setTimestamp()
    
            LogCh.send({ embeds: [embed] })
        }
    })


}