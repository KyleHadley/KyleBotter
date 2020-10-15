"use strict";

const SQLite = require("better-sqlite3");
const sqlScores = new SQLite("./scores.sqlite");
const ticketsDb = new SQLite("./lottoTickets.sqlite");

const funcs = require("../sqlFunctions");
const { maxTicketsForPurchase, ticketCost } = require('../settings/lotto-config.json');

module.exports = {
	name: 'joinlotto',
	description: 'Spend points to join the lottery.',
	cooldown: 2,
	usage: '[number of tickets to purchase (1-10)]',
	aliases: ['joinlottery', 'buylotto', 'buylottery'],
	guildOnly: true,
	execute(message, args) {
		// Set variables
		let requestedTickets = args[0];
		const userId = message.author.id;
		let tickets = funcs.getTickets(userId, message.guild.id);
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

		// Prevent users buying decimal value of tickets
		requestedTickets = Math.floor(requestedTickets);
		// Error check for NaN
		if (!isNaN(requestedTickets)) {
			// Make sure user can afford to buy x tickets
			let userscore = funcs.getScore(userId, message.guild.id);

			const costOfTicketsPurchased = requestedTickets * ticketCost;
			if ((costOfTicketsPurchased) > userscore) {
				return message.reply(`You do not have enough points to spend on this many tickets!`);
			}

			// Add them to the db if not already added
			if (!tickets && requestedTickets <= maxTicketsForPurchase) {
				CompleteTicketTransaction(tickets, message, userId, userscore, requestedTickets, costOfTicketsPurchased);

				return message.reply(`You have purchased ${requestedTickets} lottery tickets. This cost you ${costOfTicketsPurchased} points.`);
			}
			// Have previously bought tickets, so double check they cant go beyond max
			else if (requestedTickets >= 1) {
				const ticketsAvailableToPurchase = maxTicketsForPurchase - tickets.tickets;
				if(requestedTickets <= ticketsAvailableToPurchase)
				{
				let totalTickets = tickets.tickets + requestedTickets;
				
				CompleteTicketTransaction(tickets, message, userId, userscore, totalTickets, costOfTicketsPurchased);

				return message.reply(`You have purchased ${requestedTickets} lottery tickets. This cost you ${costOfTicketsPurchased} points.`
					+ `\n You now have a total of ${totalTickets} tickets.`);
				}
				else {
					return message.reply(`You have already purchased ${tickets.tickets} lottery tickets. You can buy up to ${ticketsAvailableToPurchase} more tickets.`);
				}
			}
			else {
				return message.reply(`You have already purchased ${tickets.tickets} lottery tickets. You may only buy ${ticketsAvailableToPurchase} more tickets.`);
			}


		}
		else {
			return message.reply(`Error with this command, argument was NaN.`);
		}
	},
};

// Update database for new ticket value and points after purchasing tickets
function CompleteTicketTransaction(tickets, message, userId, userscore, requestedTickets, costOfTicketsPurchased) {
	tickets = { id: `${message.guild.id}-${userId}`, user: userId, guild: message.guild.id, tickets: requestedTickets };
	funcs.setTickets(tickets);
	console.log(`User: ${message.author.username} has ${userscore.points} points, buying ${requestedTickets} tickets.`);
	userscore.points -= costOfTicketsPurchased;
	funcs.setScore(userscore);
	console.log(`User: ${message.author.username} now has ${userscore.points} points.`);
}
