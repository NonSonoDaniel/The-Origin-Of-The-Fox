console.clear()
//---------------------------------
const { IntentsBitField, Client, Partials, Collection, ActivityType, Routes, REST } = require('discord.js');
const { readdirSync } = require("node:fs");
const mongoose = require("mongoose")
//---------------------------------
const { Data } = require('./config/config.json');

//---------------------------------

const client = new Client({ intents: Object.values(IntentsBitField.Flags),
    partials: [Partials.Message, Partials.GuildMember, Partials.Channel, Partials.User, Partials.Reaction],  
})
//---------------------------------

client.once("ready", () => {
    client.user.setStatus("idle");
    client.user.setActivity(`The Origin of the Fox`, { type: ActivityType.Watching });
    console.log(`[BOT] Mi sono avviato correttamente in "${client.user.username}" ✅`)
});
mongoose.set('strictQuery', false);
mongoose.connect(Data.urlmongodb)
.then(() => console.log(`[DATABASE] Connessione al database eseguita con successo! ✅`))
.catch((err) => console.error(err));

//---------------------------------

// lettura comandi
client.commands = new Collection();
readdirSync('./src/commands/').forEach(dir => {
    const commands = readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith('.js'));
for (const file of commands) {
const command = require(`./commands/${dir}/${file}`);
client.commands.set(command.data.name, command);
//console.log(command)
}});
//---------------------------------
 client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);

    if (!command) return;
  try {
      await command.run(interaction, client);
  } catch (error) {
      console.error(error);
  }
});
//---------------------------------

const commands = [];
readdirSync('./src/commands/').forEach(dir => {
    const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = (`./commands/${dir}/${file}`);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}});

const rest = new REST({ version: "10" }).setToken(Data.token);


rest.put(Routes.applicationGuildCommands(Data.clientID, Data.guildID), { body: commands })
    .then(() => console.log(`[SLASH] Ho caricato correttamente tutti gli Slash Commands! ✅`))
    .catch(console.error);

//---------------------------------
readdirSync('./src/events/').forEach((dir) => {
    const files = readdirSync(`./src/events/${dir}/`).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const event = require(`./events/${dir}/${file}`);
        //console.log(event)

        if (!event.name) return
        if (event.once) {
            client.once(event.name, (...args) => event.run(client, ...args));
        } else {
            client.on(event.name, (...args) => event.run(client, ...args));
        };
    };
});
//---------------------------------

//Functions
// readdirSync('./src/functions/').forEach((file) => require(`./functions/${file}`)(client))
//---------------------------------

//Logs
readdirSync('./src/logs/').forEach((file) => require(`./logs/${file}`)(client))
//---------------------------------
//Server
readdirSync('./src/Server/').forEach((file) => require(`./Server/${file}`)(client))
//---------------------------------

client.login(Data.token)

//--------------------------------