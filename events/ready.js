const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
const client = require("../index");

client.on("ready", () => {
    console.log(cyan.bold(`🪐 https://discord.azury.live`));
    console.log(green(`[🚩BOT] → ` + magenta(`${client.user.tag}`) +  ` is up & ready!`));
    console.log(green(`[🚩BOT] → https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`))
    client.user.setActivity(client.config.activity.replace("{shards}", client.cluster.id)
    , { type: client.config.status.type })
    client.user.setStatus(client.config.status)
});
