const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose");
const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
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
  setTimeout(async()=> {
  console.log(blue(`[✅] :`)+`: Loaded the "Events" files`.green.bold)
  }, 200)
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(`${process.cwd()}/SlashCommands/*/*.js`);
  setTimeout(async()=> {
  console.log(blue(`[✅] :`)+`: Loaded the "SlashCommands" files`.green.bold)
  }, 200)
    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
      const file = require(value);
      if (!file?.name) return;
      client.slashCommands.set(file.name, file);
      arrayOfSlashCommands.push(file);
    }); 

    
    client.on("messageCreate", async (message, user) => {
      if(message.content.startsWith(`${config.prefix}deploy`)) {
        try {
        if(!message.member.permissions.has("MANAGE_GUILD")) {
        return message.reply(`**You cannot use this \`Deploy\` command!**\n> **There are \`${arrayOfSlashCommands.length} Slash-Commands\` for ${client.user.username}!**`);
      }
      let themsg = await message.reply(`**Attempting to set the GUILD Slash Commands in \`${message.guild.name}\`...**`)
await client.application.commands.set(arrayOfSlashCommands).then((slashCommandsData) => {
      themsg.edit(`Starting to load **${slashCommandsData.size}** slash commands to this guild... \n _It's recommended to use command 4x times to ensure acurate deploy_`);
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
      if(message.content.startsWith(`${config.prefix}help`)) {
        return message.reply(`Sorry, but this bot doesnt't use \`Prefix\` command!\n_Due to Discord changing their policies we use \`Slash\` commands_.\n\n**__Don't see the \`Slash\` Commands in you're guild?__**\n***Then use the \`${config.prefix}deploy\` command __4x times__!***`)
      }
    })
      

    client.on('guildCreate', async (guild) => {
   await client.application.commands.set(arrayOfSlashCommands);
   return console.log(`⚡ I was Invited to ${guild.name}! I will now start creating the Slash Commands (If i have perms)`)
    })



  if(client.config.mongoDB.is_enabled == true) {
    
    mongoose.connect(process.env.mongoURL || client.db.mongoDB.mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }).then(console.log(blue(`[✅] :`)+`: The MongoDB is CONNECTED`.green.bold)).catch(async(e)=> {
      console.log(blue(`[⚠️] :`)+`: The MongoDB is HAVING ISSUES "Failed to Connect"`.yellow.bold)
  })
  } else {
    console.log(blue(`[❌] :`)+`: The MongoDB is DISABLED`.red.bold)
  }
    

}


