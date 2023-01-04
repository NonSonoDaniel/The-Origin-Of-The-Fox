const { Client, EmbedBuilder } = require('discord.js');
const { Canali, Data, Embed } = require("../config/config.json")
const moment = require('moment');
/**
 * @param {Client} client
 */

module.exports = (client) => {
    
    client.on("guildMemberAdd", async (member) => {
        const guild = client.guilds.cache.get(Data.guildID);
        const whCh = guild.channels.cache.get(Canali.Logs.JoinAndLeave);
        const Join = new EmbedBuilder()
        .setTitle("<:Pikachu:1057810243553337354> **JOIN** <:Pikachu:1057810243553337354>")
        .setColor("Green")
        .setDescription(`L'utente <@${member.id}> è entrato nel server!`)
        .addFields(
            {
                name: "**Data di entrata:**", value: `${moment.utc().format("DD/MM/YYYY hh:mm:ss")}`
            }
        )
        whCh.send({ embeds: [Join], ephemeral: false });
    })

    }