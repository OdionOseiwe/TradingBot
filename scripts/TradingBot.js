require('dotenv').config()
const Web3 = require('web3');
const express = require('express')
// const moment = require('moment-timezone')
const IUniswapV2Factory = require("@uniswap/v2-core/build/IUniswapV2Factory.json");
const IUniswapV2Router02 = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json');
// const IUniswapV2Pair = require('@uniswap/v2-core/build/IUniswapV2Pair.json')
const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')
var HDWalletProvider = require("truffle-hdwallet-provider");
const OD_USDabi = require('./OD_USD.json');

// SERVER CONFIG
const PORT = process.env.PORT || 5000
const app = express();
// const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))

// WEB3 CONFIG
const web3 = new Web3(new HDWalletProvider(process.env.ACCOUNT_PRIVATE_KEY, process.env.ALCHEMY_CELO_API_KEY_URL) )

const uFactoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
const RouterAddress = web3.utils.toChecksumAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")

const testTokenAddress = web3.utils.toChecksumAddress("0xaEbAdA4742e65fc6Aa66fC890b105d0516EDBC18")

const USDAddress = "0xB42071eF8901912Cc92A59De04f6d49dd58a88A8"


const uFactory = new web3.eth.Contract(IUniswapV2Factory.abi, uFactoryAddress)
const uRouter = new web3.eth.Contract(IUniswapV2Router02.abi, RouterAddress)
const OD_testToken = new web3.eth.Contract(IERC20.abi, testTokenAddress)
const OD_USD = new web3.eth.Contract(OD_USDabi.abi, USDAddress)

const OD_testToken_SELL_PRICE = web3.utils.toWei('2', 'Ether')

console.log("running");

async function sellOD_testToken(_OD_testToken_SELL_PRICE, _AmounOut) {
  // Create event listener to listen to PairCreated
  let path =[testTokenAddress,USDAddress]
  

    // const uPair = new web3.eth.Contract(IUniswapV2Pair.abi, pair)
    // const token = new web3.eth.Contract(IERC20.abi, path[1]) // Path[1] will always be the token we are buying.

    // console.log(`Checking liquidity...\n`)

    // // Ideally you'll probably want to take a closer look at reserves, and price from the pair address
    // // to determine if you want to snipe this particular token...
    // const reserves = await uPair.methods.getReserves().call()

    // if (reserves[0] == 0 && reserves[1] == 0) {
    //     console.log(`Token has no liquidity...`)
    //     return
    // }

    console.log(`Swapping TESTTOKEN...\n`)


  // Set Deadline 1 minute from now
  const moment = require('moment') 
  const now = moment().unix() // fetch current unix timestamp
  const DEADLINE = now + 60 // add 60 seconds
  console.log("Deadline", DEADLINE)

  // Perform Swap
  console.log("checking OD_testtoken balance \n");

  let bal = await OD_testToken.methods.balanceOf(process.env.ACCOUNT).call()

  console.log(bal, "my sepolia balance of testToken");

  let bal2 = await OD_testToken.methods.balanceOf(process.env.ACCOUNT).call()

  console.log(bal2, "my sepolia balance of OD_USDToken");
  const gasApprove = await OD_testToken.methods.approve(RouterAddress, _OD_testToken_SELL_PRICE).estimateGas({ from: process.env.ACCOUNT })

  console.log(gasApprove, "gas for approving");

  await OD_testToken.methods.approve(RouterAddress, _OD_testToken_SELL_PRICE).send({ from: process.env.ACCOUNT ,  gas: gasApprove  })
  console.log("finishing approving");

  console.log('Performing swap...')
  const gas = await uRouter.methods.swapExactTokensForTokens(_OD_testToken_SELL_PRICE,_AmounOut,path, process.env.ACCOUNT, DEADLINE).estimateGas({ from: process.env.ACCOUNT })
  await uRouter.methods.swapExactTokensForTokens(_OD_testToken_SELL_PRICE, _AmounOut, path, process.env.ACCOUNT, DEADLINE).send({ from: process.env.ACCOUNT, gas: gas })

  console.log("finish swap");

  const symbol = await OD_USD.methods.symbol().call()
  const tokenBalance = await OD_USD.methods.balanceOf(process.env.ACCOUNT).call()

  console.log(tokenBalance);

  console.log(`Successfully swapped ${_OD_testToken_SELL_PRICE} Od_testtoken for ${web3.utils.fromWei(tokenBalance.toString(), 'ether')} ${symbol}\n`)

  // console.log(`Successful Swap: https://sepolia.etherscan.io/tx/${result.transactionHash}`)

}


  sellOD_testToken(OD_testToken_SELL_PRICE, 1).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

