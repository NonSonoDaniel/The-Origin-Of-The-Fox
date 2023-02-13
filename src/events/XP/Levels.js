const { Client, Message } = require("discord.js");
const { Canali, Ruoli } = require("../../config/config.json");
const levelDB = require("../../Schema/XP.js");
const economyDB = require("../../Schema/Economy.js");

/**
 * @param {Client} client
 * @param {Message} message
 */

module.exports = {
  name: "messageCreate",
  async run(client, message) {

    
    // Xp
   const { author, guild } = message;
    if (!guild || author.bot) return;
    
    if (message.member.roles.cache.has(Ruoli.BlackZone)) return;
    const LastChance = guild.channels.cache.get(Canali.LastChance);
    if (message.channel === LastChance) return;
    
    levelDB.findOne(
      { User: author.id, ServerID: guild.id },
      async (err, data) => {
        if (err) throw err;
        
        if (!data) {
          levelDB.create({
            User: author.id,
            XP: 0,
            XPT: 0,
            Livello: 0,
            Prestigio: 0,
            ServerID: guild.id,
          });
        }
      }
      );
      
      const levelChannel = guild.channels.cache.get(Canali.XP);
      
      const data = await levelDB
      .findOne({ User: author.id, ServerID: guild.id })
      .catch((err) => {});
      if (!data) return;
      
      if(data.Livello === 100) return;
      
      let give = Number
      if(data.Prestigio >= 1) give = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
      if(data.Prestigio >= 2) give = Math.floor(Math.random() * (30 - 5 + 1)) + 5;
      if(data.Prestigio == 0) give = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
      if(message.member.roles.cache.has(Ruoli.Founder)) give = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
      //console.log(give)
    const requiredXP = data.Livello * data.Livello * 100 + 100;
    
    if (data.XP + give >= requiredXP) {
      data.XP += give;
      data.XPT += give;
      data.Livello += 1;
      await data.save();
      
      const VolpiCoinDB = await economyDB.findOne({ User: author.id });
      if(VolpiCoinDB) {

      if (!VolpiCoinDB) return; //console.log(`L'utente ${author.tag} non è registrato all'economia del server, quindi non gli verranno accreditati i VolpiCoin!`);
      const euro = VolpiCoinDB.Euro;
      const utente = message.guild.members.cache.get(data.User)
      if(data.Livello === 5) {
        await economyDB.updateOne({ User: author.id }, {$set: {Euro: euro + 250}}) 
        utente.roles.add(Ruoli.XP.Novellino);
      } 
      if(data.Livello === 10) {
        await economyDB.updateOne({ User: author.id }, {$set: {Euro: euro + 500}}) 
      } 
      if(data.Livello === 15) {
        await economyDB.updateOne({ User: author.id }, {$set: {Euro: euro + 750}}) 
        utente.roles.add(Ruoli.XP.Giovanechiaccherone);
      } 
      if(data.Livello === 20) {
        await economyDB.updateOne({ User: author.id }, {$set: {Euro: euro + 1000}})
      } 
      if(data.Livello === 30) {
        await economyDB.updateOne({ User: author.id }, {$set: {Euro: euro + 1500}})
        utente.roles.add(Ruoli.XP.Chiaccherone)
      }  
      if(data.Livello === 40) {
        await economyDB.updateOne({ User: author.id }, {$set: {Euro: euro + 2000}})
      }  
      if(data.Livello === 50) {
        await economyDB.updateOne({ User: author.id }, {$set: {Euro: euro + 2500}})
        utente.roles.add(Ruoli.XP.Speaker)
      }  
      if(data.Livello === 60) {
        await economyDB.updateOne({ User: author.id }, {$set: {Euro: euro + 3000}})
      }  
      if(data.Livello === 70) {
        await economyDB.updateOne({ User: author.id }, {$set: {Euro: euro + 3500}})
      }  
      if(data.Livello === 75) {
        await economyDB.updateOne({ User: author.id }, {$set: {Euro: euro + 500}}) 
        utente.roles.add(Ruoli.XP.ChiaccheronePRO);
      } 
      if(data.Livello === 80) {
        await economyDB.updateOne({ User: author.id }, {$set: {Euro: euro + 4000}})
      }

      if(data.Livello === 90) {
        await economyDB.updateOne({ User: author.id }, {$set: {Euro: euro + 4500}})
      }  
      if(data.Livello === 100) {
        await economyDB.updateOne({ User: author.id }, {$set: {Euro: euro + 5000}})
        utente.roles.add(Ruoli.XP.ParlatoreProfessionista);
      }  

    await economyDB.updateOne({ User: author.id }, {$set: {Euro: euro + 200}})

    }
      if (levelChannel) {
        if (!levelChannel) return;
        
        levelChannel.send({
          content: `Congratulazioni <@${author.id}>!\nHai appena raggiunto il livello **${data.Livello}**!\nContinua così, potresti sbloccare ruoli speciali 🥳`,
        });

      }
    } else {
      data.XP += give;
      data.XPT += give;
      await data.save();
    };
  },
};
