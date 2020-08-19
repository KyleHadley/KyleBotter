"use strict";

const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
	name: 'testcolour',
	description: 'Get a colour code and display a preview on discord themes',
	usage: `[colour code]`,
	aliases: ['testcolor'],
	async execute(message, args) {

		const username = message.author.username;

		// Canvas stuff
		const canvas = Canvas.createCanvas(200, 50); // Create canvas to emote max pixel size
		const ctx = canvas.getContext("2d");

		let colourCode = args[0];
		console.log(`Taking colour code: ${colourCode}`);

		ctx.font = 'bold 16px Fira Sans';
		ctx.fillStyle = colourCode;
		var text = ctx.measureText(username);
		ctx.fillText(username, 0, canvas.height/2);

		//ctx.drawImage(image, 0, 0, largeEmoteSize, largeEmoteSize);
		//ctx.drawImage(image, 100, 26, emoteWithTextSize, emoteWithTextSize);
		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'test-colour.png');

		message.channel.send(attachment);
	},
};