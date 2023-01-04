const { Client, EmbedBuilder } = require('discord.js');
const { Canali, Embed, Data } = require('../config/config.json');

/**
* @param {Client} client
*/

module.exports = (client) => {

    
    client.on("guildBanRemove",  function (user, member ) {
    const guild = client.guilds.cache.get(Data.guildID);
    const channel = guild.channels.cache.get(Canali.Logs.ban);

const banEmbed = new EmbedBuilder()
.setTitle("**BAN**")
.setColor(Embed.ColoreLog)
.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
.addFields(
    {
        name: "**Utente:**", value: `<@${user.id}> ||${user.id}}|| `
    },
    {
        name: "**Data:**", value: Date.now()
    },
)
channel.send({ embeds: [banEmbed] })

})

}