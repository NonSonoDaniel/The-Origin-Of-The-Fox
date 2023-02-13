const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { Embed, Canali } = require('../../config/config.json');
const db = require('../../Schema/VoicePrivate.js')

const bottoniC = [
    { customId: 'si', value: 'Si' },
    { customId: 'no', value: 'No' }
];

module.exports = {
data: new SlashCommandBuilder()
.setName('chiave')
.setDescription('Aggiungi il ruolo ad un utente del tuo canale canale privato.')
.setDMPermission(false)
.addStringOption(option =>
    option.setName('azione')
        .setDescription('Azione da eseguire.')
        .setRequired(true)
        .addChoices(
            { name : 'aggiungi', value : 'add' },
            { name : 'rimuovi', value : 'rem' },
        ))
.addUserOption(option =>
    option.setName('utente')
    .setDescription('Utente a cui aggiungere la chiave.')
    .setRequired(true)),
    
    async run(interaction) {
        try {
            const user = interaction.options.getMember('utente');
            const utente = interaction.member.guild.members.cache.get(user.id);
            const azione = interaction.options.getString("azione")
            const VoiceDB = await db.findOne({ userID: interaction.user.id });
            const noBanca = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setDescription(`<@${interaction.user.id}> Questo comando può essere eseguito solo in <#${Canali.Commands}>!`)
            .setColor("Red")
            .setTimestamp();
            
            if(interaction.channel.id != Canali.Commands) return interaction.reply({ embeds: [noBanca], ephemeral: true });
            if(!VoiceDB) return interaction.reply({ content: "Non hai un canale privato! Di conseguenza non puoi usare questo comando!", ephemeral: true })
        
        const attesa = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setColor(Embed.ColoreDefault)
        .setDescription(`*Confermi l'aggiunta della tua chiave (<@&${VoiceDB.roleID}>) a ${utente}?*`)
        .setFooter({ text: "Hai 1 minuto di tempo!" })
        .setTimestamp();
        

        const bottoni = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('si')
            .setLabel('Conferma')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId('no')
            .setLabel('Annulla')
            .setEmoji('✖️')
            .setStyle(ButtonStyle.Danger)
            );

            const bottoniPost = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('post_si')
                .setLabel('Conferma')
                .setEmoji('✅')
                .setDisabled()
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                .setCustomId('post_no')
                .setLabel('Annulla')
                .setEmoji('✖️')
                .setDisabled()
                .setStyle(ButtonStyle.Danger)
                );
            
        
        let inizio = await interaction.reply({ embeds: [attesa], components: [bottoni] })

        const filter = button => ['si', 'no'].includes(button.customId) && button.user.id === interaction.user.id;  
        const collector = await inizio.awaitMessageComponent({ filter: filter, time: 60000, componentType: ComponentType.Button });
        const { value } = bottoniC.find(button => button.customId === collector.customId);

        if(azione === "add") {

        if(value === 'Si') {
            const successo = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setColor("Green")
            .setDescription(`*La tua chiave (<@&${VoiceDB.roleID}>) è stata aggiunta correttamente a ${utente}*`)
            .setTimestamp();

            await interaction.editReply({ embeds: [successo] })
            await utente.roles.add(VoiceDB.roleID);
            collector.update({ components: [bottoniPost] })
        } else if(value === 'No') {

            const successo = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setColor("Red")
            .setDescription(`*La chiave non è stata aggiunta come da te richiesto!*`)
            .setTimestamp();

            await interaction.editReply({ embeds: [successo] })
            collector.update({ components: [bottoniPost] })
            }
            } else if (azione === "rem") {

                if(value === 'Si') {
                    const successo = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                    .setColor("Green")
                    .setDescription(`*La tua chiave (<@&${VoiceDB.roleID}>) è stata rimossa correttamente a ${utente}*`)
                    .setTimestamp();
        
                    await interaction.editReply({ embeds: [successo] })
                    await utente.roles.remove(VoiceDB.roleID);
                    collector.update({ components: [bottoniPost] })
                } else if(value === 'No') {
        
                    const successo = new EmbedBuilder()
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                    .setColor("Red")
                    .setDescription(`*La chiave non è stata rimossa come da te richiesto!*`)
                    .setTimestamp();
        
                    await interaction.editReply({ embeds: [successo] })
                    collector.update({ components: [bottoniPost] })
                    }

            }
        } catch (error) {
            const timeoutU = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setColor("Red")
            .setDescription(`Tempo scaduto!`)
            .setTimestamp();
            

            if (error.code === 'InteractionCollectorError') {
                return interaction.editReply({ embeds: [timeoutU] })
            }
console.log(error);
        
        }
    }
}