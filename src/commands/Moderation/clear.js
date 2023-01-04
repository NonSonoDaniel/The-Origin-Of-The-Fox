const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder, PermissionFlagsBits, ButtonStyle, ComponentType } = require('discord.js');
const { Embed, Canali } = require('../../config/config.json');


const buttonMonthOptions = [
    { customId: 'si', value: '✅' },
    { customId: 'no', value: '<:cz_cross:590234470221742146>' }
];

module.exports = {
        data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Cancella i messaggi. (Max. 99)')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addNumberOption(option => 
            option.setName('msg')
            .setDescription('Numero di messaggi da cancellare')
            .setRequired(true)),

    async run(interaction) {
        try {
        const msgCh = interaction.guild.channels.cache.get(Canali.Logs.Message)

        let msg = interaction.options.getNumber('msg')
        
        if (msg < 1 || msg > 99) {
            return interaction.reply({ content: 'Devi inserire un numero compreso tra\n\n\`\`\`css\n1 e 99\`\`\`', ephemeral: true });
        }
     
        const EmbedConferma = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setDescription(`Sei sicuro di voler cancellare **${msg}** messaggi nel canale <#${interaction.channel.id}>?`)
        .setColor(Embed.ColoreDefault)
        .setTimestamp()
        .setFooter({ text: 'Hai 1 minuto di tempo!' })

        const row_first = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('si')
            .setLabel('Conferma')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId('no')
            .setLabel('Annulla')
            .setEmoji('<:cz_cross:590234470221742146>')
            .setStyle(ButtonStyle.Danger)
            );
            
            let msgInit = await interaction.reply({ embeds: [EmbedConferma], components: [row_first], fetchReply: true, ephemeral: true })
            
            const updated_row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('updated_si')
                 .setLabel('Conferma')
                 .setEmoji('✅')
                 .setDisabled()
                 .setStyle(ButtonStyle.Success),    
               )
            new ButtonBuilder()
            .setCustomId('updated_no')
             .setLabel('Annulla')
             .setEmoji('<:cz_cross:590234470221742146>')
             .setDisabled()
             .setStyle(ButtonStyle.Danger)
            
            const filter = button => ['si', 'no'].includes(button.customId) && button.user.id === interaction.user.id;  
            const collector = await msgInit.awaitMessageComponent({ filter: filter, time: 60000, componentType: ComponentType.Button });
            const { value } = buttonMonthOptions.find(button => button.customId === collector.customId);
                        
                        if (value === '✅') {
                            try {
                            const EmbedMsg = new EmbedBuilder()
                            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                            .setDescription(`Hai cancellato correttamente **${msg}** messaggi nel canale <#${interaction.channel.id}>.`)
                            .setColor("#6495ed")
                            .setTimestamp()

                            
                            
                            await interaction.channel.bulkDelete(msg, true)
                            await collector.update({ components: [updated_row] })
                            interaction.editReply({ embeds: [EmbedMsg], ephemeral: true })
                            const LogMsg = new EmbedBuilder()
                            .setTitle("**🧹 CLEAR 🧹**")
                            .addFields(
                               {
                                    name: "**Messaggi eliminati:**", value: `${msg}`, inline: false
                                },
                                {
                                    name: "**Canale:**", value: `<#${interaction.channel.id}>`, inline: false
                                },
                                {
                                    name: "**Staff:**", value: `<@${interaction.user.id}>`, inline: false
                                },
                            )
                            .setColor("#daa520")
                            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()
                            msgCh.send({ embeds: [LogMsg] })
                            } catch (err) {
                                const errore = new EmbedBuilder()
                                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                                .setDescription(`Si è verificato un errore, riprova! ❌`)
                                .setTimestamp();
                                console.error(err)
                                    return interaction.editReply({ embeds: [errore], ephemeral: true});
                            }
                            } else {
                                const clearCancelled = new EmbedBuilder()
                                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                                .setColor("#6495ed")
                                .setDescription(`I messaggi non sono stati cancellati come da te richiesto!`)
                                .setTimestamp();
                                await collector.update({ components: [updated_row] });
                                return interaction.editReply({embeds: [clearCancelled], ephemeral: true});
                               }

                                } catch (error) {
                                const timeout = new EmbedBuilder()
                                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                                .setColor("Red")
                                .setDescription(`Tempo scaduto!`)
                                .setTimestamp();
                                
                    
                                
                                if (error.code === 'INTERACTION_COLLECTOR_ERROR') {
                                    interaction.editReply({embeds: [timeout]});;
                                }
        console.log(error);
        }
    }

    }