require('dotenv').config()
const express = require('express')
const http = require('http')
var {ethers, JsonRpcProvider} = require('ethers');
const url = "https://mainnet.infura.io/v3/e7af8fc766b941c498bc770af5246568";
const provider = new ethers.providers.JsonRpcProvider(url);



// Setting up the server for the bot to listen from
const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))








