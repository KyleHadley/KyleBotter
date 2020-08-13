"use strict";

const Discord = require('discord.js');
const Canvas = require('canvas');

const emoteWithTextSize = 22; // 22x22
const largeEmoteSize = 48; // 48x48
const outputAspectRatio = 1;

module.exports = {
	name: 'testemote',
	description: 'Get an emote image and see it at its default large emote size',
	usage: `[image link (ending with '.jpg' etc.)]`,
	async execute(message, args) {

		const canvas = Canvas.createCanvas(200, 50); // Create canvas to emote max pixel size
		const ctx = canvas.getContext("2d");

		let imageLink = args[0];
		console.log(`Taking emote info: ${imageLink}`);
		
		// Todo: make this image loading to aspect ratio a reusable function
		//try {
			const image = await Canvas.loadImage(imageLink);
			// let's store the width and height of our image
			const inputWidth = image.naturalWidth;
			const inputHeight = image.naturalHeight;

			let inputRatio = inputWidth / inputHeight;
			let outputWidth = image.naturalWidth;
			let outputHeight = image.naturalHeight;

			if(inputRatio > outputAspectRatio) {
				image.width = inputHeight * outputAspectRatio;
			}
			else if(inputRatio < outputAspectRatio){
				image.height = inputWidth * outputAspectRatio;
			}

		//}
		//catch (e) {
			//console.log(`Error with provided image link: `, e);
		//}
		ctx.drawImage(image, 0, 0, largeEmoteSize, largeEmoteSize);
		ctx.drawImage(image, 100, 26, emoteWithTextSize, emoteWithTextSize);
		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'test-emote.png');

		message.channel.send(`Test Emote at max emote size (48x48) and with text (22x22):`, attachment);
	},
};