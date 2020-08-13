const Discord = require("discord.js");
const sqlFunc = require("../sqlFunctions");
const SQLite = require("better-sqlite3");
const ticketsDb = new SQLite("./lottoTickets.sqlite");

// Minimum participants needed for a lottery to go ahead.
const minParticipants = 1;
// base lottery winnings
const baseWinnings = 30; //Todo: Base it variable to number of users in a guild?
const winningsMultiplier = 3;

module.exports = {
	name: 'clearlottery',
	guildOnly: true,
	ownerOnly: true,
	aliases: ['deletelottery', 'clearlotto'],
	description: "Clear lottery database",
    execute(message) {
		const guildId = message.guild.id;
		
		// Clear database for new lottery
		sqlFunc.clearCurrentLottery(guildId)

        return message.reply("Database cleared.");
    }
};