"use strict";

const SQLite = require("better-sqlite3");
const scoresDb = new SQLite("./scores.sqlite");
const funcs = require("../sqlFunctions");
const { ownerID } = require('../config.json');

const { client } = require("../index");

module.exports = {
	name: 'givepoints',
	description: 'Give your points to another use.',
	usage: '<number of points to give> <@user>',
	cooldown: 5,
	aliases: ['give', 'transfer'],
	guildOnly: true,
	execute(message, args) {
		const isOwner = ownerID === message.author.id;
    	if(!isOwner) return message.channel.send(`Only the bot owner can give points.`);

		const user = message.mentions.users.first() || message.client.users.cache.get(args[0]);
		if(!user) return message.reply("You need to mention someone or give their ID.");

		const pointsToAdd = parseInt(args[1], 10);
		if(!pointsToAdd) return message.reply("Please specify how many points to give.");

		//let getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
		//let userscore = client.getScore.get(user.id, user.id);
		//let userscore = funcs.getScore.get(user.id, message.guild.id);
		let userscore = funcs.getScore(user.id, message.guild.id);
		//client.getScore.get(message.author.id, message.guild.id);
		console.log(`User: ${user} points ${userscore.points} adding ${pointsToAdd} points.`);

		// It's possible to give points to a user we haven't seen, so we need to initiate defaults here too!
		if (!userscore) {
			userscore = { id: `${message.guild.id}-${user.id}`, user: user.id, guild: message.guild.id, points: 0, level: 1 }
		  }
		  userscore.points += pointsToAdd;
		  funcs.setScore(userscore);
		
		return message.reply(`You gave ${pointsToAdd} to ${user}. They now have ${userscore.points} points and are level ${userscore.level}!`)
	},
};