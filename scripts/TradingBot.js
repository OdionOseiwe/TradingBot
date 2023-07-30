require('dotenv').config()
const express = require('express')
const http = require('http')
const ethers = require('ethers');
const url = "https://mainnet.infura.io/v3/e7af8fc766b941c498bc770af5246568";
const provider = new ethers.providers.JsonRpcProvider(url);
const IUniswapV2Factory = require("@uniswap/v2-core/build/IUniswapV2Factory.json")
const IUniswapV2Router02 = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json')
const IUniswapV2Pair = require('@uniswap/v2-core/build/IUniswapV2Pair.json')
const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')


// Setting up the server for the bot to listen from
const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))

const signer = provider.getSigner();

// uniswap v2 goerli address 0x1F98431c8aD98523631AE4a59f267346ea31F984

// goerli DAI
// const DAI_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"INITIAL_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_burner","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
// const DAI_ADDRESS = '0x72560B830CeD423FBb9Ec1ae8d01B41F015a5F21'
// const DAIfactory =  new ethers.Contract(DAI_ADDRESS, interface, signer)

const EXCHANGE_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const exchangeContract = new ethers.Contract(EXCHANGE_ADDRESS, IUniswapV2Router02, signer)
const WETH = new web3.eth.Contract(IERC20.abi, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')


const AMOUNT = '0.25' // How much WETH are you willing to spend on new tokens?
const SLIPPAGE = 0.05 // 5% Slippage


async function buyToken(TokenAddress) {  
    // setting path
    let path = [WETH._address,TokenAddress]

  
    // Perform Swap
    console.log('Performing swap...')
    const amountIn = ethers.utils.formatEther(AMOUNT);
    console.log(amountIn);
    const amounts = await exchangeContract.methods.getAmountsOut(amountIn, path).call()
    const amountOut = String(amounts[1] - (amounts[1] * SLIPPAGE))

    // Set Deadline 1 minute from now
    const moment = require('moment') // import moment.js library
    const now = moment().unix() // fetch current unix timestamp
    const DEADLINE = now + 30 // add 30 seconds
    console.log("Deadline", DEADLINE)

            await WETH.methods.approve(exchangeContract._address, amountIn).send({ from: signer })
            const gas = await exchangeContract.methods.swapExactTokensForTokens(amountIn, amountOut, path, signer, DEADLINE).estimateGas({ from: signer })
            await exchangeContract.methods.swapExactTokensForTokens(amountIn, amountOut, path, signer, DEADLINE).send({ from: signer, gas: gas })
    
}

await  buyToken();