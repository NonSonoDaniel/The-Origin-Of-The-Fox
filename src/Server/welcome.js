const { Client, Message } = require('discord.js');
const { Canali, Data } = require('../config/config.json')
/**
 * @param {Client} client
 * @param {Message} message
 */

module.exports = (client, message) => {
    
    client.on("guildMemberAdd", async (member) => {
        const guild = client.guilds.cache.get(Data.guildID);
        const whCh = guild.channels.cache.get(Canali.Welcome);
        whCh.send({ content: `:fox_spin_1: Benvenuto ${member.id}\nTi invitiamo a leggere il regolamento qui: ${Canali.Regolamento}\nPer la verifica clicca l'emoji sotto il regolamento e riceverai il ruolo Verificato!\nBuon Proseguimento! :waka_waka: `, ephemeral: false });
    })

    }