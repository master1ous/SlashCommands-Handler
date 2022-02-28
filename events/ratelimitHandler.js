const client = require("../index.js")

client.on('rateLimit', (info) => {
  console.log(`RATE LIMIT >> ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
})