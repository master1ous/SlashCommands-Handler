const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
const client = require("../index");

client.on("ready", () => {
    console.log(cyan.bold(``+blue(`[⚡] :`)+`: Powered by: https://discord.gg/azury`));
    console.log(green(``+blue(`[🤖] :`)+`: Logged in as: ` + magenta(`${client.user.tag}`)));
    console.log(green(``+blue(`[🔗] :`)+`: https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`))
    client.user.setActivity(client.config.activity.replace("{shards}", client.cluster.id)
    , { type: client.config.status.type })
    client.user.setStatus(client.config.status)
});
