"use strict";

const SQLite = require("better-sqlite3");
const sqlScores = new SQLite("./scores.sqlite");
//const sqlLotto = new SQLite("./lottery.sqlite");
const ticketsDb = new SQLite("./lottoTickets.sqlite");

const funcs = require("../sqlFunctions");
const ticketCost = 5;
const maxTicketsForPurchase = 10;
// TODO: Create a lottery json file

module.exports = {
	name: 'joinlotto',
	description: 'Spend points to join the lottery.',
	cooldown: 2,
	usage: '[number of tickets to purchase (1-10)]',
	aliases: ['joinlottery', 'buylotto', 'buylottery'],
	guildOnly: true,
	execute(message, args) {

		let requestedTickets = args[0];

		const username = message.author.username;
		console.log(`User: ${username} requested to buy ${requestedTickets} tickets.`);
		if (!requestedTickets || requestedTickets < 1 || requestedTickets > maxTicketsForPurchase) {
			return message.reply(`You must request a number of tickets between 1 and 10.`);
		}

		if (!Number.isInteger(requestedTickets)) {
			if (typeof requestedTickets === 'string' || requestedTickets instanceof String) {
				// Allow users to type -joinlotto all to buy max tickets
				if (requestedTickets.toLowerCase().includes('all')) {
					requestedTickets = maxTicketsForPurchase;
					console.log(`Giving ${username} the maximum number of ${requestedTickets} (${maxTicketsForPurchase}) tickets.`);
				}
			} else {
				return message.reply(`You must request a number of tickets between 1 and 10.`);
			}
		}


		// Make sure user can afford to buy x tickets
		const userId = message.author.id;
		let userscore = funcs.getScore(userId, message.guild.id);
		// Prevent users buying decimal value of tickets
		requestedTickets = Math.floor(requestedTickets);
		const costOfTicketsPurchased = requestedTickets * ticketCost;
		if ((costOfTicketsPurchased) > userscore) {
			return message.reply(`You do not have enough points to spend on this many tickets!`);
		}
		else {
			let tickets = funcs.getTickets(userId, message.guild.id);
			// Add them to the db if not already added
			if (!tickets || tickets.tickets < 1) {

				// Error check for NaN
				if (!isNaN(requestedTickets)) {
					tickets = { id: `${message.guild.id}-${userId}`, user: userId, guild: message.guild.id, tickets: requestedTickets };

					funcs.setTickets(tickets);
					console.log(`User: ${message.author.username} has ${userscore.points} points, buying ${requestedTickets} tickets.`);

					userscore.points -= costOfTicketsPurchased;
					funcs.setScore(userscore);
					console.log(`User: ${message.author.username} now has ${userscore.points} points.`);
					return message.reply(`You have purchased ${requestedTickets} lottery tickets. This cost you ${costOfTicketsPurchased} points.`);
				}
				else {
					return message.reply(`Error with this command, argument was NaN.`);
				}
			}
			else {
				return message.reply(`You have already purchased ${tickets.tickets} lottery tickets. (Buying across separate commmands not supported yet).`);
				//todo let a user keep buying tickets more than once
			}
		}
	},
};