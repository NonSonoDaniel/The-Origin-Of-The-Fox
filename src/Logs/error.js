const { Client, EmbedBuilder } = require('discord.js'); 
const { Canali } = require('../config/config.json');

/**
* @param {Client} client
*/
module.exports = (client) => {

    const EmbedError = new EmbedBuilder()
    .setTitle('**Si è verificato un errore! ⚠️**')
    .setColor("#8b0000")
    .setTimestamp();

    process.on("unhandledRejection", (reason, p) => {

        console.log(reason, p)
    
        const errorCh = client.channels.cache.get(Canali.Errore);
        if(!errorCh) return;
    
        errorCh.send({ embeds: 
            [
            EmbedError.setDescription("**Errore:\n\n** ```" + reason + "``` ")
            ] 
        });

    });

    process.on("uncaughtException", (err, origin) => {

        console.log(err, origin)
    
        const errorCh = client.channels.cache.get(Canali.Errore);
        if(!errorCh) return;
    
        errorCh.send({ embeds: 
            [
            EmbedError.setDescription("**Errore:\n\n** ```" + err + "\n\n" + origin.toString() + "``` ")
            ] 
        });
    });


};