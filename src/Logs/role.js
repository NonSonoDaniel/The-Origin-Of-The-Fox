const { Client, EmbedBuilder } = require('discord.js');
const { Data, Embed, Canali } = require("../config/config.json");
const moment = require('moment')

/**
 * @param {Client} client
 */

module.exports = async (client) => {
    
    
    client.on("roleCreate", function (role) {
            const guild = client.guilds.cache.get(Data.guildID);
            const logCh = guild.channels.cache.get(Canali.Logs.role)

                const MemberRole = new EmbedBuilder()
                .setTitle("**ROLE CREATED**")
                .setColor("Green")
                .addFields(
                    {
                        name: "**Nome e ID:**", value: `${role.name} || ${role.id}`
                    },
                    {
                        name: "**Colore (HEX):**", value: `${role.hexColor}`
                    },
                    {
                        name: "**Posizione:**", value: `${role.position}`
                    },
                    {
                        name: "**Visibile separatamente?**", value: `${role.hoist ? "Yes" : "No"}`
                    },
                    {
                        name: "**Menzionabile?**", value: `${role.mentionable ? "Yes" : "No"}` 
                    },
                    {
                        name: "**Data:**", value: `${moment.utc().format("DD/MM/YYYY hh:mm:ss")}` 
                    },
                )
                  
                logCh.send({ embeds: [MemberRole] });
            });

            client.on("roleDelete", function (role) {
        
                const guild = client.guilds.cache.get(Data.guildID);
                const logCh = guild.channels.cache.get(Canali.Logs.role)
    
                    const MemberRole = new EmbedBuilder()
                    .setTitle("**ROLE Delete**")
                    .setColor("Red")
                    .addFields(
                        {
                            name: "**Nome e ID:**", value: `${role.name} || ${role.id}`
                        },
                        {
                            name: "**Colore (HEX):**", value: `${role.hexColor}`
                        },
                        {
                            name: "**Data:**", value: `${moment.utc().format("DD/MM/YYYY hh:mm:ss")}` 
                        },
                    )
                      
                    logCh.send({ embeds: [MemberRole] });
                });

                client.on("roleUpdate", function (oldRole, newRole) {

                    const guild = client.guilds.cache.get(Data.guildID);
                    const logCh = guild.channels.cache.get(Canali.Logs.role)
    
                    if (oldRole.name != newRole.name) {
                        const embed = new EmbedBuilder()
                            .setDescription(`**Nome del ruolo ${newRole} (${newRole.name}) modificato!**`)
                            .setColor(Embed.ColoreLog)
                            .setFooter({ text: `ID: ${newRole.id}` })
                            .setAuthor({ name: newRole.guild.name, iconURL: newRole.guild.iconURL() })
                            .addFields(
                                { name: 'Prima:', value: oldRole.name },
                                { name: 'Dopo:', value: newRole.name },
                            )
                            .setTimestamp();
                            logCh.send({ embeds: [embed] })
    
                    }
        
                    // role colour change
                    if (oldRole.color != newRole.color) {
                        const embed = new EmbedBuilder()
                            .setDescription(`**Colore del ruolo ${newRole} (${newRole.name}) modificato!**`)
                            .setColor(Embed.ColoreLog)
                            .setFooter({ text: `ID: ${newRole.id}` })
                            .setAuthor({ name: newRole.guild.name, iconURL: newRole.guild.iconURL() })
                            .addFields(
                                { name: 'Prima:', value: `${oldRole.color} ([${oldRole.hexColor}](https://www.color-hex.com/color/${oldRole.hexColor.slice(1)}))` },
                                { name: 'Dopo:', value: `${newRole.color} ([${newRole.hexColor}](https://www.color-hex.com/color/${newRole.hexColor.slice(1)}))` },
                            )
                            .setTimestamp();
                            logCh.send({ embeds: [embed] })
                    }
        
                    // role permission change
                    if (oldRole.permissions.bitfield != newRole.permissions.bitfield) {
                        const embed = new EmbedBuilder()
                            .setDescription(`**Permessi del ruolo ${newRole} (${newRole.name}) modificati!**\n[Permessi corrispondenti ai numeri](https://discordapi.com/permissions.html#${oldRole.permissions.bitfield})`)
                            .setColor(Embed.ColoreLog)
                            .setFooter({ text: `ID: ${newRole.id}` })
                            .setAuthor({ name: newRole.guild.name, iconURL: newRole.guild.iconURL() })
                            .addFields(
                                { name: 'Prima:', value:`${oldRole.permissions.bitfield}` },
                                { name: 'Dopo:', value: `${newRole.permissions.bitfield}` },
                            )
                            .setTimestamp();
                            logCh.send({ embeds: [embed] })
                    }

                })
                    }
                
        
    
        
            
    
