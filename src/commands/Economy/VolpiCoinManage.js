const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { Embed } = require('../../config/config.json')
const AccountDB = require('../../Schema/Economy.js');
const euroManageDB = require('../../Schema/VolpiCoinManage.js');
const moment = require('moment')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('euro')
		.setDescription('Aggiungi, Rimuovi, Visualizza gli euro di un utente.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false)
        .addStringOption((option) => option.setName('azione')
            .setDescription('Scegli l\'azione da eseguire.')
            .setRequired(true)
            .addChoices(
                { name : 'aggiungi', value : 'add' },
                { name : 'rimuovi', value : 'rem'},
                { name : 'visualizza', value : 'view'}
            ))
        .addUserOption((option) => option.setName('utente')
            .setDescription('Seleziona l\'utente.')
            .setRequired(true))
        .addNumberOption((option) => option.setName('euro')
            .setDescription('La quantità di euro da assegnare.')
            .setRequired(false)),

	async run(interaction) {
        const utente = interaction.options.getUser('utente');

        const scelta = interaction.options.getString('azione');

        const portafoglio = await AccountDB.findOne({ User: utente.id });

		const embedF = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setDescription('L\'utente non ha un portafoglio!')
        .setColor('Red')
        .setTimestamp();

        if (!portafoglio) return await interaction.reply({ embeds : [embedF] })

        const portafoglioEmbed = new EmbedBuilder()
        .setTitle(utente.username)
        .setURL(`https://discord.com/users/${utente.id}`)
        .setDescription(`👤 | Profilo utente: <@!${utente.id}>\n🦊 | Volpicoin: **${portafoglio.VolpiCoin}**\n💸 | Euro: **${portafoglio.Euro}**\n📨 | Euro Inviati: **${portafoglio.EuroInviati}**\n📩 | Euro Ricevuti: **${portafoglio.EuroRicevuti}**`)
        .setColor(Embed.ColoreT)
        .setTimestamp()
        
        if (scelta == 'view') {

            await interaction.reply({ embeds: [portafoglioEmbed] });
        }

        if (scelta == 'add') {

            const euro = interaction.options.getNumber('euro');

            const embedA = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription('Devi selezionare l\'opzione euro!')
            .setColor('Red')
            .setTimestamp();

            if (!euro) return interaction.reply({ embeds: [embedA], ephemeral: true })

            const embedB = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription('Non puoi assegnare più di 100.000 euro 💸!')
            .setColor('Red')
            .setTimestamp();

            if (euro > 100000 || euro < 100) return interaction.reply({ embeds: [embedB], ephemeral: true })

            await AccountDB.updateOne({ userID: utente.id }, {$set:{euro: portafoglio.Euro+euro}}), 

            new euroManageDB({
                Azione: "Aggiunta euro",
                User: utente.id,
                Staff: interaction.user.id,
                euro: euro,
                Data: moment.utc().format("DD/MM/YYYY hh:mm:ss")

            }).save().then(async () => {

                const embedC = new EmbedBuilder()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTitle('Saldo aggiornato!')
                .addFields(
                    {
                        name: `**Ricevente: ${utente.tag}**`, value: `**euro**:  *${portafoglio.Euro}* => *${portafoglio.Euro+euro}*`
                    }
                )
                .setColor('Green')
                .setTimestamp(); 

                await interaction.reply({ embeds : [embedC] });

            })
        }
        if (scelta == 'rem') {

            const euro = interaction.options.getNumber('euro');

            const embedA = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription('Devi selezionare l\'opzione euro!')
            .setColor('Red')
            .setTimestamp();

            if (!euro) return interaction.reply({ embeds: [embedA], ephemeral: true })

            const embedB = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription('Il saldo dell\'utente non può andare in negativo!')
            .setColor('Red')
            .setTimestamp();

            if (portafoglio.Euro-euro < 0) return interaction.reply({ embeds: [embedB], ephemeral: true })

            await AccountDB.updateOne({ userID: utente.id }, {$set:{euro: portafoglio.Euro-euro}}), 

            new euroManageDB({
            Azione: "Rimozione euro",
            User: utente.id,
            Staff: interaction.user.id,
            euro: euro,
            Data: moment.utc().format("DD/MM/YYYY hh:mm:ss")

        }).save().then(async () => {
            const embedC = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTitle('Saldo aggiornato!')
            .addFields(
                {
                    name: `**Ricevente: ${utente.tag}**`, value: `**euro**:  *${portafoglio.Euro}* => *${portafoglio.Euro-euro}*`
                }
            )
            .setColor('Green')
            .setTimestamp(); 
            
            await interaction.reply({ embeds : [embedC] });

            })
        }
    }
};