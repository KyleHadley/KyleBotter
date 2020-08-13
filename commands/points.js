"use strict";

const SQLite = require("better-sqlite3");
const scores = new SQLite("./scores.sqlite");
const sqlFunc = require("../sqlFunctions");

module.exports = {
	name: 'points',
	description: 'Shows your points.',
	cooldown: 5,
	aliases: ['point', 'score', 'level'],
	guildOnly: true,
	execute(message, args) {
		const guildId = message.guild.id;

		if(args > 0){
			// Allow user to query another users points
			//let targetUser = args[1];
			const targetUser = message.mentions.users.first() || message.client.users.cache.get(args[0]);
			let score = sqlFunc.getScore(targetUser.id, guildId);
			if(!score)
			{
				return message.reply(`Error, could not find user. You have either entered an incorrect argument or this user is not registered in the database.`);
			}
			else{
				return message.reply(`${targetUser} has ${score.points} points and are level ${score.level}!`);
			}
		}
		else
		{
			let score = sqlFunc.getScore(message.author.id, guildId);
			return message.reply(`You currently have ${score.points} points and are level ${score.level}!`);
		}	
	},
};