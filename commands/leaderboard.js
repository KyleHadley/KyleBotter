"use strict";

const SQLite = require("better-sqlite3");
const sql = new SQLite("./scores.sqlite");

const { client } = require("../index");
const Discord = require("discord.js");

module.exports = {
	name: 'leaderboard',
	description: 'See the top 10 scorers.',
	cooldown: 5,
	aliases: ['top10', 'scoreboard', 'topscores'],
	guildOnly: true,
	execute(message, args) {

		const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(message.guild.id);

		//message.guild.members.cache.get(winningUserId);

		// Paste scores onto an embed
		const embed = new Discord.MessageEmbed().setTitle("Leaderboard");
		embed.setAuthor(client.user.username, client.user.avatarURL());
		embed.setDescription("The top 10 point leaders:");
		embed.setColor(0x00AE86);

		for (const data of top10) {

			let userName = "Unknown User";

			// TODO: Handle/remove users who have left the server
			userName = client.users.cache.get(data.user);
			if (!userName) {
				userName = "Null";
			}
			else {
				userName = userName = client.users.cache.get(data.user).username;
			}

			embed.addFields({ name: userName, value: `${data.points} points (level ${data.level})` });



		}

		return message.channel.send({ embed });
	},
};