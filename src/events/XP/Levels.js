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
      if(data.Prestigio > 0) give = Math.floor(Math.random() * (30 - 5 + 1)) + 5;
      if(data.Prestigio == 0) give = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
      if(message.member.roles.cache.has(Ruoli.Founder)) give = Math.floor(Math.random() * (50 - 30 + 1)) + 30;
     // console.log(give)
    const requiredXP = data.Livello * data.Livello * 100 + 100;
    
    if (data.XP + give >= requiredXP) {
      data.XP += give;
      data.XPT += give;
      data.Livello += 1;
      await data.save();
      
      const VolpiCoinDB = await economyDB.findOne({ User: author.id });
      if(VolpiCoinDB) {

      if (!VolpiCoinDB) return; //console.log(`L'utente ${author.tag} non è registrato all'economia del server, quindi non gli verranno accreditati i VolpiCoin!`);
      const volpicoin = VolpiCoinDB.VolpiCoin;
      const utente = message.guild.members.cache.get(data.User)
      if(data.Livello === 10) await economyDB.updateOne({ User: author.id }, {$set: {VolpiCoin: volpicoin + 1000}}), utente.roles.add(Ruoli.XP.Novellino);
      if(data.Livello === 20) await economyDB.updateOne({ User: author.id }, {$set: {VolpiCoin: volpicoin + 2000}})
      if(data.Livello === 30) await economyDB.updateOne({ User: author.id }, {$set: {VolpiCoin: volpicoin + 3000}})
      if(data.Livello === 40) await economyDB.updateOne({ User: author.id }, {$set: {VolpiCoin: volpicoin + 4000}})
      if(data.Livello === 50) await economyDB.updateOne({ User: author.id }, {$set: {VolpiCoin: volpicoin + 5000}})
      if(data.Livello === 60) await economyDB.updateOne({ User: author.id }, {$set: {VolpiCoin: volpicoin + 6000}})
      if(data.Livello === 70) await economyDB.updateOne({ User: author.id }, {$set: {VolpiCoin: volpicoin + 7000}})
      if(data.Livello === 80) await economyDB.updateOne({ User: author.id }, {$set: {VolpiCoin: volpicoin + 8000}})
      if(data.Livello === 90) await economyDB.updateOne({ User: author.id }, {$set: {VolpiCoin: volpicoin + 9000}})
      if(data.Livello === 100) await economyDB.updateOne({ User: author.id }, {$set: {VolpiCoin: volpicoin + 10000}})

    await economyDB.updateOne({ User: author.id }, {$set: {VolpiCoin: volpicoin + 300}})

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
