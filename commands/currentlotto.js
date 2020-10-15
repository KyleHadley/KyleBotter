const Discord = require("discord.js");
const sqlFunc = require("../sqlFunctions");
const SQLite = require("better-sqlite3");
const ticketsDb = new SQLite("./lottoTickets.sqlite");

const { minParticipants, ticketCost, baseWinnings, winningsMultiplier } = require('../settings/lotto-config.json');

module.exports = {
	name: 'currentlotto',
	description: "Shows the details of the current lottery in progress.",
	aliases: ['checklotto', 'lotto', 'lottery'],
	guildOnly: true,
    execute(message) {
		const guildId = message.guild.id;
		
		var eligibleUsers =  sqlFunc.getLottoEntrants(guildId);

		if(eligibleUsers.length < 1){
			return message.reply("There were no users found in the database!.");
		}

		const totalTicketsPurchased = sqlFunc.totalLottoTickets(guildId);

		if(totalTicketsPurchased < 1) {
			return message.reply("Error, could not find any tickets in the lottery database.");
		}
	
		console.log(`${totalTicketsPurchased} total tickets counted across ${eligibleUsers.length} users.`);


		let lotteryWinnings = baseWinnings + (totalTicketsPurchased * winningsMultiplier);

        const lotteryEmbed = new Discord.MessageEmbed().setColor('#7289da');
        lotteryEmbed.setTitle('Current Lottery');
		lotteryEmbed.setDescription(`The current lottery has had ${totalTicketsPurchased} tickets bought across ${eligibleUsers.length} users!
		The current prize pool for this lottery is **${lotteryWinnings}** points!
		\nUse -joinlotto [*number of tickets to purchase*] to join the lottery.
		tickets cost ${ticketCost} points per ticket.`);
		
        if (message.author.bot) {
            lotteryEmbed.setColor('#7289da');
        }
        message.channel.send(lotteryEmbed);
    }
};