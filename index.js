'Use strict';

// A reference to the Discord.js module
const Discord = require("discord.js");
const { prefix, token } = require('./config.json');
const fs = require("fs");

const SQLite = require("better-sqlite3");
const scoresDb = new SQLite("./scores.sqlite");
const sqlFuncs = require("./sqlFunctions");

const cooldowns = new Discord.Collection();

// Create a new discord client
const client = new Discord.Client();
exports.client = client;

client.commands = new Discord.Collection();
// Returns an array with all the file names in commands directory
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(`Loaded ${file} command.`);

    // Seat a new item in the collection
    // The key is the command name and value is exported module
    client.commands.set(command.name, command);
}
console.log(`Loaded a total of ${commandFiles.length} commands.`)

// Bot is now loaded and ready
client.on("ready", () => {
    client.user.setActivity(`on ${client.guilds.cache.size} servers`);
    console.log(`Logged in as ${client.user.tag} on ${client.guilds.cache.size} servers, for ${client.users.cache.size} users.`);

    // Check if table "points" exists.
    const table = scoresDb.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name ='scores';").get();
    if(!table['count(*)']) {
        // If the table isn't there, create it and setup the database
        scoresDb.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run();
        // Esnure that the "id" row is always unique and indexed.
        scoresDb.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores(id);").run();
        scoresDb.pragma("synchronous = 1");
        scoresDb.pragma("journal_mode = wal");
    }
});

// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.
//require("./modules/functions.js")(client);

client.on("message", message => {
    // Ignore other bots and messages not beginning with our prefix
    if (message.author.bot) return;

    IncrementPointsInGuild(message);

    // Messages with this prefix will be checked against our commands
    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    console.log(`Message recieved from ${message.author.username}: "${message.content.trim()}".`);

    // Look for command name or aliases
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command) return;

    console.log(`Recognised command for '${commandName}'`);

    // Check if a command only works inside a server (e.g. a kick command)
    if(command.guildOnly && message.channel.type !== 'text') {
        return message.reply("I can't execute that command inside DMs!");
    }

    // Let the user know they forgot to provide arguments if the command requires it
    if(command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        // Append usage information to the message
        if(command.usage) {
            reply += `\nProper usage is: "${prefix}${command.name} ${command.usage}".`;
        }

        return message.channel.send(reply);
    }

    if(!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 2) * 1000;

    // Check if enough time has passed before letting user use this command again
    if(timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if(now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the "${command.name}" command.`)
        }
    }

    // If timestamps collection doesnt have author's ID, create a setTimeout to automatically delete it after the cooldown
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Dynamically execute command based on our commands js files
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("There was an error trying to execute the command.");
    }

});

client.login(token);


function IncrementPointsInGuild(message) {
    if (message.guild !== null) {
        let score = sqlFuncs.getScore(message.author.id, message.guild.id);

        // If we've never seen this use before, we need to define their initial values
        if (!score) {
            score = {
                id: `${message.guild.id}-${message.author.id}`,
                user: message.author.id,
                guild: message.guild.id,
                points: 0,
                level: 1
            };
        };
        // Increment score
        score.points++;

        // Calculate current level through math
        const curLevel = Math.floor(0.1 * Math.sqrt(score.points));

        // Check if user has leveled up and let them know if they have
        if (score.level < curLevel) {
            // Level up
            score.level++;
            message.reply(`You've leveled up to level **${curLevel}**! Congrats.`);
        }

        sqlFuncs.setScore(score);
    }
}
/*function PokeUser(args, message) {
    let userToPoke = message.mentions.members.first();
    if (!userToPoke) {
        return "No user mentioned.";
    }
    else {
        console.log(`User to poke: ${userToPoke}.`);
        let pokeMessage = `>> Poked ${userToPoke.username} -`;// ${args.slice(1).join(" ")}`);
        return pokeMessage.toString();
    }

};*/

// Catch errors
//NOTE: The debug event WILL output your token, so exercise caution when handing over a debug log.
// client.on("error", (e) => console.error(e));
// client.on("warn", (e) => console.warn(e));
// client.on("debug", (e) => console.info(e));