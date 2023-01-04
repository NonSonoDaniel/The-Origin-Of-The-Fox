 const { Client, Message, MessageType } = require('discord.js')
 
 /**
 * @param {Client} client
 * @param {Message} message
 */

module.exports = {
    name: "messageCreate",
    async run(client, message) {
 
 //Menzione
    if(message.content.includes("@here") || message.content.includes("@everyone") || MessageType.Reply) return false;
    if (message.content.has(client.user.id)) return message.channel.send({ content: `Salve <@${author.id}>!\nPer usufruire dei miei " *poteri mistici* " puoi usare gli slash commands!\n( per capirci... usa questo / e poi *attaccato* il nome del comando... cercali da bravo :) )`, ephemeral: false });
   
    }
}