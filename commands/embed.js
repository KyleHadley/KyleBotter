const Discord = require("discord.js");

module.exports = {
	name: 'embed',
	description: 'Get an embed message.',
	execute(message) {
		const exampleEmbed = new Discord.MessageEmbed().setColor('#7289da');
		exampleEmbed.setTitle('Some title');

		//const imageFile = new Discord.MessageAttachment("https://i.imgur.com/yEh4h1d.jpeg");
		exampleEmbed.setImage("https://i.imgur.com/yEh4h1d.jpeg");

		if(message.author.bot) {
			exampleEmbed.setColor('#7289da');
		}
		//console.log("Test");
		message.channel.send(exampleEmbed);
	},
};