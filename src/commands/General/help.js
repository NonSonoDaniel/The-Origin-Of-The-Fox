const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Ruoli, Canali } = require('../../config/config.json');
 //---------------------------------

module.exports = {
data: new SlashCommandBuilder()
.setName('help')
.setDescription('Comando help per le funzioni di "The Origin Of The Fox"!')
.setDMPermission(false),

async run(interaction) {

    const noBanca = new EmbedBuilder()
    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
    .setDescription(`<@${interaction.user.id}> Questo comando può essere eseguito solo in <#${Canali.Commands}>!`)
    .setColor("Red")
    .setTimestamp();
    
    if(interaction.channel.id != Canali.Commands) return interaction.reply({ embeds: [noBanca], ephemeral: true });

 const helpP0 = new EmbedBuilder()
 .setTitle("Help Center")
 .setDescription("Di seguito ci sono le varie categorie che riguardano i comandi, clicca i bottoni sottostanti per vedere la lista dei comandi.")
 .setColor("Fuchsia")
 .addFields( 
    {name: "Pagina 1:", value: "Economia (bottone 1)"},
    {name: "Pagina 2:", value: "XP (bottone 2)"},
    {name: "Pagina 3:", value: "Stanze (bottone 3)"},
    {name: "Pagina 4:", value: "Moderazione (bottone 4) - Solo staff"}, 
    {name: "Pagina 5:", value: "Owner (bottone 5) - Solo Owner"}
 );

const helpP1 = new EmbedBuilder()
 .setTitle("Comandi dell'economia")
 .setColor("DarkGreen")
 .addFields( 
    {name: "Converti", value: "Converti gli **Euro 💸** in **<:Volpicoin:1074419328599998484> VolpiCoin** e viceversa."},
    {name: "Daily", value: "Riscatta una somma di **Euro 💸** casuale! (1 volta al giorno!)."},
    {name: "Pay", value: "Invia una somma di **Euro 💸** ad un utente."},
    {name: "Portafoglio", value: "Visualizza il tuo portafoglio."},
 )
 .setTimestamp()

 const helpP2 = new EmbedBuilder()
 .setTitle("Comandi dell'XP")
 .setColor("Aqua")
 .addFields( 
    {name: "xp_classifica", value: "Visualizza la classifica XP di The Origin of the Fox."},
    {name: "xp_level", value: "Visualizza il tuo livello."},
    {name: "xp_prestigio", value: "Ottieni il prestigio una volta arrivati al livello **100**."},
 )
 .setTimestamp()

 const helpP3 = new EmbedBuilder()
 .setTitle("Comandi Stanze")
 .setColor("Blurple")
 .addFields( 
    {name: "Move", value: "Sposta un utente nella tua stanza privata."},
    {name: "Chiave", value: "Aggiungi/rimuovi la chiave della tua stanza ad una persona."},
)
 .setTimestamp()

 const helpP4 = new EmbedBuilder()
 .setTitle("Comandi Moderazione")
 .setColor("White")
 .addFields( 
    {name: "Announce", value: 'Manda un messaggio nel canale "Annunci".'},
    {name: "Ban", value: "Banna un utente dal server."},
    {name: "Kick", value: "Espelle un utente dal server."},
    {name: "BlackList", value: "Aggiungi un utente alla BlackList"},
    {name: "Clear", value: "Elimina un numero di messaggi (max. 99) nel canale in cui viene effettuato il comando."},
    {name: "Role", value: "Aggiungi/rimuovi un ruolo ad un utente."},
    {name: "Say", value: "Invia un messaggio anonimo nel canale in cui viene effettuato il comando."},

)
 .setTimestamp();

 const helpP5 = new EmbedBuilder()
 .setTitle("Comandi Owner")
 .setColor("Gold")
 .addFields( 
    {name: "SetPrivate", value: 'Aggiunge un utente al **DataBase** delle **Stanze private**.'},
    {name: "SetBorsa", value: "Aggiorna il valore di borsa del **<:Volpicoin:1074419328599998484> VolpiCoin**."},
    {name: "SetOwner", value: "Aggiungi i privilegi da **Owner** ad un utente."},
    {name: "Euro-action", value: "Aggiungi, Rimuovi, Visualizza gli **Euro 💸** di un utente."},
)
 .setTimestamp()

 const button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId("page1")
        .setLabel("Economia")
        .setEmoji("💸")
        .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
        .setCustomId("page2")
        .setLabel("XP")
        .setEmoji("⭐")
        .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
        .setCustomId("page3")
        .setLabel("Stanze")
        .setEmoji("🏠")
        .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
        .setCustomId("page4")
        .setLabel("Moderazione")
        .setEmoji("🛡️")
        .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
        .setCustomId("page5")
        .setLabel("Owner")
        .setEmoji("✨")
        .setStyle(ButtonStyle.Success),

    )
 
    const message = await interaction.reply({ embeds: [helpP0], components: [button] });
    const collector = await message.createMessageComponentCollector();

    collector.on('collect', async i => {
        
        const utente = i.guild.members.cache.get(i.user.id);

        if(i.customId === "page1") {

            if(i.user.id !== interaction.user.id) return await i.reply({ content: "Solo chi ha fatto questo comando può utilizzare i bottoni!", ephemeral: true })

            await i.update({ embeds: [helpP1], components: [button] });
        }

        if(i.customId === "page2") {

            if(i.user.id !== interaction.user.id) return await i.reply({ content: "Solo chi ha fatto questo comando può utilizzare i bottoni!", ephemeral: true })
            
            await i.update({ embeds: [helpP2], components: [button] });
        }

        if(i.customId === "page3") {

            if(i.user.id !== interaction.user.id) return await i.reply({ content: "Solo chi ha fatto questo comando può utilizzare i bottoni!", ephemeral: true })
            
            await i.update({ embeds: [helpP3], components: [button] });
        }

        if(i.customId === "page4") {

            if(i.user.id !== interaction.user.id) return await i.reply({ content: "Solo chi ha fatto questo comando può utilizzare i bottoni!", ephemeral: true })
            if(!utente.roles.cache.has(Ruoli.Staff)) return await i.reply({ content: "Il bottone della lista comandi della **Moderazione** è riservato allo staff!", ephemeral: true })

            await i.update({ embeds: [helpP4], components: [button] });
        }

        if(i.customId === "page5") {

            if(i.user.id !== interaction.user.id) return await i.reply({ content: "Solo chi ha fatto questo comando può utilizzare i bottoni!", ephemeral: true })
            if(!utente.roles.cache.has(Ruoli.Ghiaccio)) return await i.reply({ content: "Il bottone della lista comandi degli **Owner** è riservato a essi!", ephemeral: true })
            

            await i.update({ embeds: [helpP5], components: [button] });
        }

        }
    )


    }
}