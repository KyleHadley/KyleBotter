"use strict";

const { ownerID } = require('../config.json');

module.exports = {
  name: 'reload',
  description: 'Reloads a command',
  execute(message, args) {
    // Todo consider making this a global function
    const isOwner = ownerID === message.author.id;
    if(!isOwner) return message.channel.send(`Only the bot owner can reload commands.`);

    if (!args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}.`);

    const commandName = args[0].toLowerCase();
    const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
      return message.channel.send(`There is no command with name/alias "${commandName}", ${message.author}.`);
    }

    // Delete our command from cache so that we reload the file again
    delete require.cache[require.resolve(`./${command.name}.js`)];

    try {
      const newCommand = require(`./${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
      message.channel.send(`Command "${command.name}" was reloaded.`);
    } catch (error) {
      console.log(error);
      message.channel.send(`There was an error while reloading a command "${command.name}: \n"${error.message}".`);
    }
  },
};



/*
(client, message, args) => {
  if(!args || args.length < 1) return message.reply("Must provide a command name to reload.");
  const commandName = args[0];

  // Check if the command exists and is valid
  if(!client.commands.has(commandName)) {
    return message.reply(`There is no command with name/alias "${commandName}", ${message.author}.`);
  }

  // the path is relative to the *current folder*, so just ./filename.js
  delete require.cache[require.resolve(`./${commandName}.js`)];

  // We also need to delete and reload the command from the client.commands Enmap
  client.commands.delete(commandName);
  const props = require(`./${commandName}.js`);
  client.commands.set(commandName, props);
  message.reply(`The command ${commandName} has been reloaded`);
};*/