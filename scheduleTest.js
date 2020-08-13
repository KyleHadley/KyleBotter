const Discord = require("discord.js");
const sqlFunc = require("./sqlFunctions");
const ticketsDb = new SQLite("../lottoTickets.sqlite");

module.exports = {
    execute() {
        const { mainGuild } = require('./config.json');
        let guildId = mainGuild;

        // Choose random user from eligible users
        var user = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];

        let score = sqlFunc.getScore(user, guildId);
        // Todo make dynamic score
        let lotteryWinnings = 100;

        const lotteryEmbed = new Discord.MessageEmbed().setColor('#7289da');
        lotteryEmbed.setTitle('Lottery Winner');
        lotteryEmbed.setDescription(`The winner of the lottery is ${user.nickname}, winning ${lotteryWinnings}!!!`);

        if (message.author.bot) {
            lotteryEmbed.setColor('#7289da');
        }
        //console.log("Test");
        message.channel.send(lotteryEmbed);
    }
};