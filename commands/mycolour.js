"use strict";

const Discord = require('discord.js');

module.exports = {
	name: 'mycolour',
	description: "Get the hexadecimal colour code for a user.",
	aliases: ['mycolor'],
	guildOnly: true,
	async execute(message, args) {

		const userColour = message.member.displayHexColor//message.author.displayHexColor;


		return message.reply(`Your current user colour code is: ${userColour}.`);
	},
};