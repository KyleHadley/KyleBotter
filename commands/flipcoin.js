"use strict";

module.exports = {
	name: 'flipcoin',
	description: 'Flip a coin and determine the outcome',
	execute(message, args) {
	let coinResult = "Undecided";
	let rand = Math.floor(Math.random() * 2); // Return random number 0 or 1.
	
	if(rand === 0)
	{
		coinResult = "Heads";
	}else{
		coinResult = "Tails";
	}

    message.channel.send(`You flip a coin, it lands on ${coinResult}.`);
	},
};