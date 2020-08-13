const Discord = require("discord.js");
const sqlFunc = require("../sqlFunctions");
const SQLite = require("better-sqlite3");
const ticketsDb = new SQLite("./lottoTickets.sqlite");

// Minimum participants needed for a lottery to go ahead.
const minParticipants = 1;
// base lottery winnings
const baseWinnings = 30; //Todo: Base it variable to number of users in a guild?
const winningsMultiplier = 3;

module.exports = {
	name: 'drawlottery',
	guildOnly: true,
	ownerOnly: true,
	aliases: ['drawlotto'],
	description: "Draws the lottery results",
    execute(message) {
		const guildId = message.guild.id;
		
		var eligibleUsers =  sqlFunc.getLottoEntrants(guildId);

		if(eligibleUsers.length < 1){
			return message.reply("There were no users found in the database!.");
		} else if(eligibleUsers.length < minParticipants) {
			return message.reply(`The lottery has been postponed, need at least ${minParticipants} people to participate. Users should type -joinlotto [number of tickets to buy]`);
		}

		var arrayOfTickets = [];
		eligibleUsers.forEach(user => {
			for(t = 0; t < user.tickets; t++) {
				arrayOfTickets.push(user.user);
			}
		});

		const totalTicketsPurchased = arrayOfTickets.length;
		console.log(`${totalTicketsPurchased} total tickets counted across ${eligibleUsers.length} users.`);
		if(totalTicketsPurchased < 1) {
			return message.reply("Error, could not find any tickets in the lottery database.");
		}

		var winningUserId = arrayOfTickets[Math.floor(Math.random() * totalTicketsPurchased)];
		winningUser = message.guild.members.cache.get(winningUserId);
		
        // Todo make dynamic score
		let lotteryWinnings = baseWinnings + (totalTicketsPurchased * winningsMultiplier);

        const lotteryEmbed = new Discord.MessageEmbed().setColor('#7289da');
        lotteryEmbed.setTitle('Lottery Winner');
		lotteryEmbed.setDescription(`The winner of the lottery is ${winningUser}, winning ${lotteryWinnings} points!!`);

		//Todo: Add users new points
		let score = sqlFunc.getScore(winningUser.id, guildId);
		let newScore = lotteryWinnings + score.points;
		score.points = newScore
		sqlFunc.setScore(score);
		console.log(`${winningUser} has won the lottery, winning ${lotteryWinnings} points. They now have ${newScore} points.`);
		
		// Clear database for new lottery
		sqlFunc.clearCurrentLottery(guildId)

        if (message.author.bot) {
            lotteryEmbed.setColor('#7289da');
        }
        message.channel.send(lotteryEmbed);
    }
};