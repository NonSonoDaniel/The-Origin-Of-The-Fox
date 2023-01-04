const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, Client } = require('discord.js')
const { Webhook, Canali } = require('../../config/config.json');
const db = require('../../Schema/Announce.js');
const moment = require('moment')
/**
 * @param {Client} client
 */

module.exports = {
    data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Manda un messaggio nel canale "Annunci".')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option => 
        option.setName('msg')
        .setDescription('Messaggio da inviare. (Il messaggio sarà in forma anonima)')
        .setRequired(true)),
    async run(interaction, client) {
        const { WebhookClient } = require('discord.js')
        const messaggio = interaction.options.getString("msg");

        const WebhookSend = new WebhookClient({ id: Webhook.Announce.ID, token: Webhook.Announce.Token });
        
        WebhookSend.send({
            content: messaggio,
            username: "Volpistan",
            avatarURL: client.user.displayAvatarURL()
        })

        new db({

            userID: interaction.user.id,
            message: messaggio,
            data: moment.utc().format("DD/MM/YYYY hh:mm:ss")

        }).save().then(async () => {

    
            const successo = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
            .setColor("Green")
            .setDescription(`Ho inviato correttamente il messaggio nel canale degli annunci! (<#${Canali.Annunci}>)`)
            .setTimestamp()
            await interaction.reply({ embeds: [successo], ephemeral: true })

        })

    }
}