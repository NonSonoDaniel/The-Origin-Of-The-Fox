const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const { Embed, Canali } = require('../../config/config.json')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Espelle l\'utente dal server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false)
		.addUserOption((option) =>
			option.setName('utente')
				.setDescription('L\'utente da kickare.')
				.setRequired(true))
		.addStringOption((option) =>
			option.setName('reason')
				.setDescription('La motivazione del kick.')
				.setRequired(true)),

	async run(interaction) {

		const utente = interaction.options.getUser('utente');
		const reason = interaction.options.getString('reason');
		const user = interaction.guild.members.cache.get(utente.id);
        const logCh = interaction.guild.channels.cache.get(Canali.Logs.Kick);
        const reasonRA = `${reason + "\n" + "| Staffer:" + "\n" + interaction.user.tag}`
        const author = interaction.guild.members.cache.get(interaction.user.id)

        const EmbedLog = new EmbedBuilder()
        .setTitle("**KICK**")
        .addFields(
            {
                name: "**Utente:**", value: `${user}`, inline: false
            },
            {
                name: "**Motivo:**", value: reason, inline: false
            },
            {
                name: "**Staff:**", value: interaction.user.id, inline: false
            },
        )
        .setColor("#daa520")
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()

        const RoleEmbed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setColor(Embed.ColoreDefault)
        .setDescription("**Non puoi espellere un utente che sia più in alto di te.**")
        .setTimestamp()

        const AutoKick = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setColor(Embed.ColoreDefault)
        .setDescription("**Non puoi espellere te stesso!**")
        .setTimestamp()

        const Successo = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setDescription("**Espulsione avvenuta con successo!**")
        .setColor("#6495ed")
        .addFields(
            {
                name: "**Utente:**", value: `${user}`, inline: false
            },
            {
                name: "**Motivo:**", value: reason, inline: false
            },
        )
        .setTimestamp()

        const embedUser = new EmbedBuilder()
        .setAuthor({ name: user.user.username, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`Sei stato espulso dal server **${interaction.guild}!**`)
        .setColor("#daa520")
        .addFields(
            {
                name: "**Motivo:**", value: reason, inline: false
            },
            {
                name: "**Staff:**", value: `<@${interaction.user.id}>`, inline: false
            }
        )
        .setTimestamp()
        .setFooter({ text: "Se ritieni che la tua espulsione sia ingiusta, ti preghiamo di farcelo sapere." })

		if (user.id == interaction.user.id) return interaction.reply({ embeds: [AutoKick], ephemeral : true });

		if (user.roles.highest.position <= author.roles.highest.position) {
			try {
				await user.send({ embeds : [embedUser] });
			}
			catch {
				interaction.reply({ content : 'Non è stato possibile inviare il messaggio di avviso all\'utente!\nSi presume che abbia i DM bloccati.', ephemeral: true });
			}
			interaction.guild.members.kick(user.id, reasonRA);
            await logCh.send({ embeds: [EmbedLog] })
			await interaction.reply({ embeds : [Successo], ephemeral: true });
		}
		else {
			interaction.reply({ embeds: [RoleEmbed], ephemeral : true });
		}
	},
};