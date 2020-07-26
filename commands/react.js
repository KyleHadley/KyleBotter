"use strict";

const Discord = require('discord.js');

module.exports = {
	name: 'react',
	description: 'React to your message with a reaction.',
	cooldown: 5,
	async execute(message, args) {

		const test = await message.channel.send('Test.');

		test.react('👍').then(() => test.react('👎'));

		const filter = (reaction, user) => {
			return ['👍', '👎'].includes(reaction.emoji.name) && !user.bot;
		};

		test.awaitReactions(filter, {max: 1, time: 60000, errors: ['time'] })
		.then(collected => {
			const reaction = collected.first();

			if(reaction.emoji.name === '👍') {
				message.channel.send("You reacted with a thumbs up.");
			}
			else{
				message.channel.send("You reacted with a thumbs down.");
			}
		})
		.catch(collected => {
			message.channel.send("No one reacted with a thumbs up or thumbs down.");
		})

	},
};