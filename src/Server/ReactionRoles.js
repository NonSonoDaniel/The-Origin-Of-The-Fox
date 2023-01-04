const { Client, EmbedBuilder } = require('discord.js');
const { ReactionRole, Ruoli, Data } = require('../config/config.json')

/**
 * @param {Client} client
 */
module.exports = (client) => {

    client.on("messageReactionAdd", async function (messageReaction, user) {
        const guild = client.guilds.cache.get(Data.guildID);

        if (user.bot) return 
    
        if (messageReaction.message.partial) await messageReaction.message.fetch();
    
        if (messageReaction.message.id == ReactionRole.Regolamento.MessageID) { 
            if (messageReaction._emoji.name == ReactionRole.Regolamento.Reaction) {
                let utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
                utente.roles.add(Ruoli.ReactionRole.Verificato);

                const successo = new EmbedBuilder()
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })} )
                .setColor("Green")
                .setDescription(`Ti è stato aggiunto il ruolo **👨‍🚀 ¦ Verificato** per aver accettato il regolamento!\nBuona permanenza 😁`)
                .setTimestamp();

                utente.send({ embeds: [successo] })
            }};
            if (messageReaction.message.id == ReactionRole.RolesCH.AnimeWorld.MessageID) { 
                if (messageReaction._emoji.name == ReactionRole.RolesCH.AnimeWorld.Reaction) {
                    let utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
                    utente.roles.add(Ruoli.ReactionRole.AnimeWorld);
    
                    const successo = new EmbedBuilder()
                    .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })} )
                    .setColor("Green")
                    .setDescription(`Ti è stato aggiunto il ruolo **🗾 ¦ Anime World Access** per aver cliccato sulla reazione!\nBuona permanenza 😁`)
                    .setTimestamp();
    
                    utente.send({ embeds: [successo] })
                }};
                if (messageReaction.message.id == ReactionRole.RolesCH.Female.MessageID) { 
                    if (messageReaction._emoji.name == ReactionRole.RolesCH.Female.Reaction) {
                        let utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
                         utente.roles.add(Ruoli.ReactionRole.Female);
        
                        const successo = new EmbedBuilder()
                        .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })} )
                        .setColor("Green")
                        .setDescription(`Ti è stato aggiunto il ruolo **🟣 ¦ Female ** per aver cliccato sulla reazione!\nBuona permanenza 😁`)
                        .setTimestamp();
        
                        utente.send({ embeds: [successo] })
                    }};
                    if (messageReaction.message.id == ReactionRole.RolesCH.Male.MessageID) { 
                        if (messageReaction._emoji.name == ReactionRole.RolesCH.Male.Reaction) {
                            let utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
                            utente.roles.add(Ruoli.ReactionRole.Male);
            
                            const successo = new EmbedBuilder()
                            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })} )
                            .setColor("Green")
                            .setDescription(`Ti è stato aggiunto il ruolo **🔵 ¦ Male** per aver cliccato sulla reazione!\nBuona permanenza 😁`)
                            .setTimestamp();
            
                            utente.send({ embeds: [successo] })
                        }};
                        if (messageReaction.message.id == ReactionRole.RolesCH.Other.MessageID) { 
                            if (messageReaction._emoji.name == ReactionRole.RolesCH.Other.Reaction) {
                                let utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
                                utente.roles.add(Ruoli.ReactionRole.Other);
                
                                const successo = new EmbedBuilder()
                                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })} )
                                .setColor("Green")
                                .setDescription(`Ti è stato aggiunto il ruolo **🏳️‍🌈 ¦ Other ** per aver cliccato sulla reazione!\nBuona permanenza 😁`)
                                .setTimestamp();
                
                                utente.send({ embeds: [successo] })
                            }};
            
    });

        client.on("messageReactionRemove", function (messageReaction, user) {
            const guild = client.guilds.cache.get(Data.guildID);

            if (user.bot) return 
            
                if (messageReaction.message.id == ReactionRole.RolesCH.AnimeWorld.MessageID) { 
                if (messageReaction._emoji.name == ReactionRole.RolesCH.AnimeWorld.Reaction) {
                    let utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
                    utente.roles.remove(Ruoli.ReactionRole.AnimeWorld);
    
                    const successo = new EmbedBuilder()
                    .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })} )
                    .setColor("Green")
                    .setDescription(`Ti è stato rimosso il ruolo **🗾 ¦ Anime World Access** tolto la reazione!\nBuona permanenza 😁`)
                    .setTimestamp();
    
                    utente.send({ embeds: [successo] })
                }};
                if (messageReaction.message.id == ReactionRole.RolesCH.Female.MessageID) { 
                    if (messageReaction._emoji.name == ReactionRole.RolesCH.Female.Reaction) {
                        let utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
                         utente.roles.remove(Ruoli.ReactionRole.Female);
        
                        const successo = new EmbedBuilder()
                        .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })} )
                        .setColor("Green")
                        .setDescription(`Ti è stato rimosso il ruolo **🟣 ¦ Female ** per aver tolto la reazione!\nBuona permanenza 😁`)
                        .setTimestamp();
        
                        utente.send({ embeds: [successo] })
                    }};
                    if (messageReaction.message.id == ReactionRole.RolesCH.Male.MessageID) { 
                        if (messageReaction._emoji.name == ReactionRole.RolesCH.Male.Reaction) {
                            let utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
                            utente.roles.remove(Ruoli.ReactionRole.Male);
            
                            const successo = new EmbedBuilder()
                            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })} )
                            .setColor("Green")
                            .setDescription(`Ti è stato rimosso il ruolo **🔵 ¦ Male** per aver tolto la reazione!\nBuona permanenza 😁`)
                            .setTimestamp();
            
                            utente.send({ embeds: [successo] })
                        }};
                        if (messageReaction.message.id == ReactionRole.RolesCH.Other.MessageID) { 
                            if (messageReaction._emoji.name == ReactionRole.RolesCH.Other.Reaction) {
                                let utente = messageReaction.message.guild.members.cache.find(x => x.id == user.id);
                                utente.roles.remove(Ruoli.ReactionRole.Other);
                
                                const successo = new EmbedBuilder()
                                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true })} )
                                .setColor("Green")
                                .setDescription(`Ti è stato rimosso il ruolo **🏳️‍🌈 ¦ Other ** per aver tolto la reazione!\nBuona permanenza 😁`)
                                .setTimestamp();
                
                                utente.send({ embeds: [successo] })
                            }};

        })
};
