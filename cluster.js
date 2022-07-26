const { red, green, blue, magenta, cyan, white, gray, black } = require("chalk");
const Cluster = require('discord-hybrid-sharding');
const { Manager } = require("discord-hybrid-sharding");
const totalShards = 4;
const colors = require("colors");
const shardsPerCluster = 2;
const config = require(`./config.json`)
const manager = new Cluster.Manager(`./index.js`, {
    totalShards: totalShards, // Use 'auto' if u want it to be Auto.
    shardsPerClusters: shardsPerCluster, 
    mode: 'process' , 
    token: process.env.token || config.token,
    respawn: true, 
    usev13: true,
});


manager.on("clusterCreate", cluster => {
    
  console.log(red(`[👍] :`)+`: Launched Cluster #${cluster.id} & ${cluster.id+1}/${cluster.manager.totalClusters} [${cluster.manager.shardsPerClusters}/${cluster.manager.totalShards} Shards]`.yellow)

    cluster.on("death", function () {
        console.log(`${colors.red.bold(`Cluster ${cluster.id} died..`)}`);
    });

    cluster.on("message", async (msg) => {
        if(!msg._sCustom) return
        if (msg.dm) {
            const { interaction, message, dm, packet } = msg
            await manager.broadcast({ interaction, message, dm, packet })
        }
    })
    cluster.on("error", e => {
      console.log(red(`[❌] :`)+`: Cluster #${cluster.id} ERROR`.red.bold)
        console.error(e);
    })
    
    cluster.on("disconnect", function () {
        console.log(red(`[❌] :`)+`: Cluster #${cluster.id} DISCONNECTED`.red.bold)
    });

    cluster.on("reconnecting", function () {
        console.log(red(`[❌] :`)+`: Cluster #${cluster.id} RECONNECTING`.red.bold)
    });

    cluster.on("close", function (code) {
        console.log(red(`[❌] :`)+`: Cluster #${cluster.id} CLOSED`.red.bold)
    });

    cluster.on("exit", function (code) {
        console.log(red(`[❌] :`)+`: Cluster #${cluster.id} EXITED`.red.bold)
    });
});
manager.on("debug", (d) => d.includes("Cluster Manager (LIST):") ? console.log(d) : "")
manager.spawn({timeout: -1});
