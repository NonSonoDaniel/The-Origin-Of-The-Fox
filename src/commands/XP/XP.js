const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const XP = require('../../Schema/XP.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('xp-action')
		.setDescription('Aggiungi, Rimuovi, Visualizza l\'xp e il livello di un utente.')
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
            .addStringOption((option) => option.setName('tipo')
            .setDescription('Scegli la tipologia.')
            .setRequired(true)
            .addChoices(
                { name : 'xp', value : 'xp' },
                { name : 'livello', value : 'livello'},
            ))
        .addUserOption((option) => option.setName('utente')
            .setDescription('Seleziona l\'utente.')
            .setRequired(true))
        .addIntegerOption((option) => option.setName('quantità')
            .setDescription('La quantità di xp/livello da assegnare.')
            .setRequired(true)),

	async run(interaction) {

    }
}