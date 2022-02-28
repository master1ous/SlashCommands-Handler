const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
    name: "stats",
    description: "View the bot's stats!",
    cooldown: 5,
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {


      interaction.followUp({ content: `**📊 Bot Stats of ${client.user.username} 📊**\n\n> **Im on \`${client.guilds.cache.size}\` Servers**\n> **Watching \`${client.users.cache.size}\` Members**\n> **Node.js: ${process.version}**\n> **Discord.js: v${Discord.version}**\n> **I am on Shard: \` ${interaction.guild.shardId} \`**` })
    }
}