const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose");
const chalk = require("chalk");
const Discord = require('discord.js');
const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });
    
    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(`${process.cwd()}/SlashCommands/*/*.js`);
    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
      const file = require(value);
      if (!file?.name) return;
      client.slashCommands.set(file.name, file);
      arrayOfSlashCommands.push(file);
    }); 

    
    client.on("messageCreate", async (message, user) => {
      if(message.content.startsWith(`${client.config.prefix}deploy`)) {
        try {
        if(!message.member.permissions.has("MANAGE_GUILD")) {
        return message.reply(`**You cannot use this \`Deploy\` command!**\n> **There are \`${arrayOfSlashCommands.length} Slash-Commands\` for ${client.user.username}!**`);
      }
      let themsg = await message.reply(`**Attempting to set the GUILD Slash Commands in \`${message.guild.name}\`...**`)
await client.application.commands.set(arrayOfSlashCommands).then((slashCommandsData) => {
      themsg.edit(`${client.emoji.correct} **Loading \`${slashCommandsData.size} Slash-Commands\`** (\`${slashCommandsData.map(d => d.options).flat().length} Subcommands\`) in ${message.guild.name}`);
        }).catch((e) => {
          console.log(e)
          themsg.edit(`**I Could not load the Slash Commands for ${message.guild.name}**\n\n**I Must be missing permissions to Create Slash-Commands! Invite me when this link:**\n> https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
        });
        }
     catch (e) {
      console.log(String(e.stack))
      return message.channel.send({
        embeds: [new Discord.MessageEmbed()
          .setColor(`RED`)
          .setTitle(`❌ Something want wrong!`)
          .setDescription(`This error isn't supposed to happen! This must be a code error! Join discord.gg/Azury for help!`)
        ]
      })
     }
      }
    })
      

    client.on('guildCreate', async (guild) => {
   await client.application.commands.set(arrayOfSlashCommands);
   return console.log(`⚡ I was Invited to ${guild.name}! I will now start creating the Slash Commands (If i have perms)`)
    })
// Mongoose
  mongoose.connect(process.env.mongo || client.config.mongo, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }).then(console.log(`🏆 Loading MONGO database`))
}


