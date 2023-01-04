const { Client, EmbedBuilder } = require('discord.js');
const { Canali, Data, Embed } = require("../config/config.json")
const moment = require('moment');
/**
 * @param {Client} client
 */

module.exports = (client) => {
    
    client.on("guildMemberRemove", async (member) => {
        const guild = client.guilds.cache.get(Data.guildID);
        const whCh = guild.channels.cache.get(Canali.Logs.JoinAndLeave);
        const Leave = new EmbedBuilder()
        .setTitle("🚀 **LEAVE** 🚀")
        .setColor("Red")
        .setDescription(`L'utente <@${member.id}> ha lasciato il server!`)
        .addFields(
            {
                name: "**Data di uscita:**", value: `${moment.utc().format("DD/MM/YYYY hh:mm:ss")}`
            }
        )
        whCh.send({ embeds: [Leave], ephemeral: false });
    })

    }