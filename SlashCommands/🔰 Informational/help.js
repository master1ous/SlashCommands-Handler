const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
    name: "help",
    description: "See all of the bots commands",
    type: 'CHAT_INPUT',
    run: async (client, interaction, args) => {
      let categories = [];

      readdirSync("./SlashCommands/").forEach((dir) => {
        const commands = readdirSync(`./SlashCommands/${dir}/`).filter((file) => file.endsWith(".js"));

        const cmds = commands.map((command) => {
          let file = require(`../../SlashCommands/${dir}/${command}`);
          if (!file.name) return "Missing file name.";
          let name = file.name.replace(".js", "");
          return `\`${name}\``;
        });
        let data = new Object();

        data = {
          name: dir.toUpperCase(),
          value: cmds.length === 0 ? "WIP 🦺" : cmds.join(" "),
        };

        categories.push(data);
      }); 

      const embed = new MessageEmbed()
      .setTitle(`Discord Bot | Handler | Azury`)
      .setColor(client.config.color.yellow)
        .addField(`About Me`, "I am a Slash COmmands Discord Bot: handler by https://discord.gg/azury\n> *GIVE CREDITS IF U USE!*")
      .addFields(categories)
      .setFooter(`Powered by Azury.live\n🔷 Server-Shard: ${interaction.guild.shardId}`, interaction.guild.iconURL())
      return interaction.followUp({ embeds: [embed] })
    },
};
