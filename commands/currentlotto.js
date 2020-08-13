const Discord = require("discord.js");
const sqlFunc = require("../sqlFunctions");
const SQLite = require("better-sqlite3");
const ticketsDb = new SQLite("./lottoTickets.sqlite");

// Minimum participants needed for a lottery to go ahead.
const minParticipants = 1;
// base lottery winnings
const baseWinnings = 30; //Todo: Base it variable to number of users in a guild?
const winningsMultiplier = 3;
const ticketCost = 5;

module.exports = {
	name: 'currentlotto',
	description: "Shows the details of the current lottery in progress.",
	aliases: ['checklotto', 'lotto'],
	guildOnly: true,
    execute(message) {
		const guildId = message.guild.id;
		
		var eligibleUsers =  sqlFunc.getLottoEntrants(guildId);

		if(eligibleUsers.length < 1){
			return message.reply("There were no users found in the database!.");
		}

		const totalTicketsPurchased = sqlFunc.totalLottoTickets(guildId);

		if(totalTicketsPurchased.length < 1) {
			return message.reply("Error, could not find any tickets in the lottery database.");
		}
	
		console.log(`${totalTicketsPurchased.length} total tickets counted across ${eligibleUsers.length} users.`);


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