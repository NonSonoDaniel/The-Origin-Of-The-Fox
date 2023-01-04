const { Client, EmbedBuilder } = require('discord.js');
const { Data, Embed, Canali } = require('../config/config.json');
const moment = require('moment');

/**
 * @param {Client} client
 */

module.exports = (client) => {

    /*client.on("messageDelete", function (message) {
        if(message.content === message.embeds) return
            //if (message.author.id == bot.user.id) return;
            if(message.author.id === client.user.id) return
            if (!message.content && message.attachments.size == 0 && message.embeds[0]) return;

            const guild = client.guilds.cache.get(Data.guildID);
            let ChLog = guild.channels.cache.get(Canali.Logs.Message);
            const MessageDelete = new EmbedBuilder()
                .setTitle("**🗑️ MESSAGE DELETE 🗑️**")
                .setColor("Red")
                .addFields(
                    {
                        name: "**Autore:**", value: `<@${message.author.id}>`, inline: false
                    },
                    {
                        name: "**Canale:**", value: `<#${message.channel.id}>`, inline: false
                    },
                    {
                        name: "**Contenuto del messaggio:**", value: `\`${message.content}\``, inline: false
                    },
                    {
                        name: "**Data:**", value: `**${moment.utc().format("DD/MM/YYYY hh:mm:ss")}**`, inline: false
                    }
                );
            ChLog.send({ embeds: [MessageDelete] });
        });*/

        client.on("messageDeleteBulk", function (message, channel) {

            const guild = client.guilds.cache.get(Data.guildID);
            let ChLog = guild.channels.cache.get(Canali.Logs.Message);
            const MessageDeleteBulk = new EmbedBuilder()
                .setTitle("**🗑️ BULK MESSAGE 🗑️**")
                .setDescription("**Ho rilevato una cancellazione di più messaggi in una volta.**")
                .setColor("Red")
                .addFields(
                    {
                        name: "**Canale:**", value: `<#${channel.id}>`, inline: false
                    },
                    {
                        name: "**Messaggi eliminati:**", value: `${message.size}`, inline: false
                    },
                    {
                        name: "**Data:**", value: `**${moment.utc().format("DD/MM/YYYY hh:mm:ss")}**`, inline: false
                    }
                );
            ChLog.send({ embeds: [MessageDeleteBulk] });
        });
        client.on("messageUpdate", function(newMessage, oldMessage) {
           // if(message.author.bot) return;
            const guild = client.guilds.cache.get(Data.guildID);
            let ChLog = guild.channels.cache.get(Canali.Logs.Message);
            const MessageUpdate = new EmbedBuilder()
            .setAuthor({ name: oldMessage.author.tag, iconURL: oldMessage.author.displayAvatarURL({ dynamic: true }) })
                .setTitle("**📝 MESSAGE UPDATE 📝**")
                .setDescription(`Messaggio modificato in <#${newMessage.channel.id}>! [Vai al messaggio](${oldMessage.url})`)
                .setColor(Embed.ColoreLog)
                .addFields(
                    {
                        name: "**Nuovo messaggio:**", value: `\`${oldMessage.cleanContent}\``, inline: false
                    },
                    {
                        name: "**Vecchio messaggio:**", value: `\`${newMessage.cleanContent}\``, inline: false
                    },
                    {
                        name: "**Data:**", value: `**${moment.utc().format("DD/MM/YYYY hh:mm:ss")}**`, inline: false
                    }
                );
            ChLog.send({ embeds: [MessageUpdate] });
        });

       /* client.on("messageCreate", function(message) {
            // if(message.author.bot) return;
             const guild = client.guilds.cache.get(Data.guildID);
             let ChLog = guild.channels.cache.get(Canali.Logs.MessageCreate);
             const MessageCreate = new EmbedBuilder()
                 .setTitle("**📩 MESSAGE CREATE 📩**")
                 .setColor("Green")
                 .addFields(
                     {
                         name: "**Autore:**", value: `<@${message.author.id}>`, inline: false
                     },
                     {
                         name: "**Canale:**", value: `<#${message.channel.id}>`, inline: false
                     },
                     {
                         name: "**Contenuto del messaggio:**", value: `\`${message.content}\``, inline: false
                     },
                     {
                         name: "**Data:**", value: `**${moment.utc().format("DD/MM/YYYY hh:mm:ss")}**`, inline: false
                     }
                 );
             return ChLog.send({ embeds: [MessageCreate] });
         });*/
}