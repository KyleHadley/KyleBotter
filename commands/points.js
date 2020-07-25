"use strict";

const SQLite = require("better-sqlite3");
const sql = new SQLite("./scores.sqlite");

module.exports = {
	name: 'points',
	description: 'Shows your points.',
	cooldown: 5,
	aliases: ['point', 'score', 'level'],
	guildOnly: true,
	execute(message, args) {

		let getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");

		let score = getScore.get(message.author.id, message.guild.id);
		return message.reply(`You currently have ${score.points} points and are level ${score.level}!`)
	},
};