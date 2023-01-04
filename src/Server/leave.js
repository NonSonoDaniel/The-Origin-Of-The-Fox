const { Client } = require('discord.js');
const { Canali, Data } = require("../config/config.json")
const moment = require('moment')
/**
 * @param {Client} client
 */

module.exports = (client) => {
    
    client.on("guildMemberRemove", async (member) => {
        const guild = client.guilds.cache.get(Data.guildID);
        const whCh = guild.channels.cache.get(Canali.Leave);
        whCh.send({ content: `L'utente <@${member.id}> ha lasciato il server il **${moment.utc().format("DD/MM/YYYY hh:mm:ss")}**`, ephemeral: false });
    })

    }