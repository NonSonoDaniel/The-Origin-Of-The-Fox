const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { Embed, Canali } = require('../../config/config.json');
const db = require('../../Schema/VoicePrivate.js')

const bottoniC = [
    { customId: 'si', value: 'Si' },
    { customId: 'no', value: 'No' }
];

module.exports = {
data: new SlashCommandBuilder()
.setName('sposta')
.setDescription('Sposta un utente da un canale all\'altro.')
.setDMPermission(false)
.addUserOption(option =>
    option.setName('utente')
    .setDescription('Utente da spostare.')
    .setRequired(true)),

    async run(interaction) {
        try {
        const user = interaction.options.getUser('utente');
        const author = interaction.member.guild.members.cache.get(interaction.user.id);
        const authorCh = author.voice.channel;
        const target = interaction.member.guild.members.cache.get(user.id);
        const targetCh = target.voice.channel;
        const VoiceDB = await db.findOne({ userID: interaction.user.id });
        const noBanca = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setDescription(`<@${interaction.user.id}> Questo comando può essere eseguito solo in <#1074311309614649384>!`)
        .setColor("Red")
        .setTimestamp();
    
        if(interaction.channel.id != "1074311309614649384") return interaction.reply({ embeds: [noBanca], ephemeral: true });
        if(!VoiceDB) return interaction.reply({ content: "Non hai un canale privato! Di conseguenza non puoi usare questo comando!", ephemeral: true })
        if(authorCh.id != VoiceDB.channelID) return interaction.reply({ content: '**Devi entrare prima nel tuo canale vocale!**', ephemeral: true });
        if(interaction.user.id == target.id) return interaction.reply({ content: '**Non puoi spostare te stesso!**', ephemeral: true });
        if(targetCh != Canali.Spostami) return interaction.reply({ content : `**L\`utente non è nel canale <#${Canali.Spostami}>!**`, ephemeral : true });

        const attesa = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setColor(Embed.ColoreDefault)
        .setDescription(`*\🚀 Teletrasporto pronto! In attesa di <@${user.id}>!\🚀*`)
        .setTimestamp();

        const attesaU = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setColor(Embed.ColoreDefault)
        .setDescription(`*\🚀 ${author} vuole spostarti nel canale <#${authorCh.id}>! \🚀*`)
        .setFooter({ text: "Scegli entro 2 minuti!" })
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
            
        
        let inizio = await target.send({ embeds: [attesaU], components: [bottoni] })
        await interaction.reply({ embeds: [attesa] });

        const filter = button => ['si', 'no'].includes(button.customId) && button.user.id === user.id;  
        const collector = await inizio.awaitMessageComponent({ filter: filter, time: 120000, componentType: ComponentType.Button });
        const { value } = bottoniC.find(button => button.customId === collector.customId);

        if(value === 'Si') {
            const successo = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setColor("Green")
            .setDescription(`*\🚀 Teletrasporto attivato per <@${user.id}> verso il canale ${authorCh} \🚀*`)
            .setTimestamp();

            const successoU = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setColor("Green")
            .setDescription(`*\🚀 Teletrasporto attivato con successo verso il canale <#${authorCh.id}> \🚀*`)
            .setTimestamp();
            
            await target.send({ embeds: [successoU] })
            await interaction.editReply({ embeds: [successo] })
            await target.voice.setChannel(authorCh);
            collector.update({ components: [bottoniPost] })
        } else if(value === 'No') {

            const successo = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setColor("Green")
            .setDescription(`*\🚀 Teletrasporto disattivato 🔧 <@${user.id}> ha rifiutato! \🚀*`)
            .setTimestamp();

            const successoU = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setColor("Green")
            .setDescription(`*\🚀 Teletrasporto rifiutato con successo!\🚀*`)
            .setTimestamp();
            await user.send({ embeds: [successoU] })
            await interaction.editReply({ embeds: [successo] })
            collector.update({ components: [bottoniPost] })
            }
        } catch (error) {
            const user = interaction.options.getUser('utente');
            const target = interaction.member.guild.members.cache.get(user.id);
            const timeoutU = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setColor("Red")
            .setDescription(`🚀 Tempo scaduto! 🚀`)
            .setTimestamp();
            
            const timeout = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
            .setColor("Red")
            .setDescription(`🚀 Teletrasporto fallito! <@${user.id}> non ha dato risposta! 🚀 `)
            .setTimestamp();

            if (error.code === 'InteractionCollectorError') {
                await target.send({ embeds: [timeoutU] })
                return interaction.editReply({ embeds: [timeout] })
            }
console.log(error);
        
        }
    }
}