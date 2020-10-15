const Discord = require("discord.js");
const sqlFunc = require("../sqlFunctions");
const SQLite = require("better-sqlite3");
const ticketsDb = new SQLite("./lottoTickets.sqlite");

const { minParticipants, baseWinnings, winningsMultiplier } = require('../settings/lotto-config.json');

module.exports = {
	name: 'testlotto',
	guildOnly: true,
	ownerOnly: true,
    execute(message) {
        //const { mainGuild } = require('./config.json');
		//let guildId = mainGuild;
		const guildId = message.guild.id;
		
		var eligibleUsers =  sqlFunc.getLottoEntrants(guildId);

		// Choose random user from eligible users
		//lottousers.forEach(eligibleUsers => {
			
		//});
		if(eligibleUsers.length < 1){
			return message.reply("There were no users found in the database!.");
		} else if(eligibleUsers.length < minParticipants) {
			return message.reply(`The lottery has been postponed, need at least ${minParticipants} people to participate. Users should type -joinlotto [number of tickets to buy]`);
		}

		var arrayOfTickets = [];
		eligibleUsers.forEach(user => {
			//let userTickets = sqlFunc.getTickets(user.user, guildId);
			for(t = 0; t < user.tickets; t++) {
				arrayOfTickets.push(user.user);
			}
			//console.log(`User '${u.name}' entered lotto with `)
		});

		const totalTicketsPurchased = arrayOfTickets.length;
		console.log(`${totalTicketsPurchased} total tickets counted across ${eligibleUsers.length} users.`);
		if(totalTicketsPurchased < 1) {
			return message.reply("Error, could not find any tickets in the lottery database.");
		}

		//var userId = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)].user;
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
		//sqlFunc.setScore(newScore);
		console.log(`${winningUser} has won the lottery, winning ${lotteryWinnings} points. They now have ${newScore} points.`);
		
		// Clear database for new lottery
		//sqlFunc.clearCurrentLottery(guildId)

        if (message.author.bot) {
            lotteryEmbed.setColor('#7289da');
        }
        //console.log("Test");
        message.channel.send(lotteryEmbed);
    }
};