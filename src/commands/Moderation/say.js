const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const db = require('../../Schema/Say.js');
const moment = require('moment')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Manda un messaggio nel canale dell\'interazione.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option => 
        option.setName('msg')
        .setDescription('Messaggio da inviare. (Il messaggio sarà in forma anonima)')
        .setRequired(true)),
    async run(interaction) {
        const messaggio = interaction.options.getString("msg");

        interaction.channel.send({ content: messaggio });

        new db({

            userID: interaction.user.id,
            message: messaggio,
            canale: interaction.channel.id,
            data: moment.utc().format("DD/MM/YYYY hh:mm:ss")

        }).save().then(async () => {

    
            const successo = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true })} )
            .setColor("Green")
            .setDescription(`Ho inviato correttamente il messaggio!`)
            .setTimestamp()
            await interaction.reply({ embeds: [successo], ephemeral: true })

        });

    },
};