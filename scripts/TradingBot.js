require('dotenv').config()
const Web3 = require('web3');
const express = require('express')
// const moment = require('moment-timezone')
const IUniswapV2Factory = require("@uniswap/v2-core/build/IUniswapV2Factory.json");
const IUniswapV2Router02 = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json');
// const IUniswapV2Pair = require('@uniswap/v2-core/build/IUniswapV2Pair.json')
const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')
var HDWalletProvider = require("truffle-hdwallet-provider");

// SERVER CONFIG
const PORT = process.env.PORT || 5000
const app = express();
// const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))

// WEB3 CONFIG
const web3 = new Web3(new HDWalletProvider(process.env.ACCOUNT_PRIVATE_KEY, process.env.ALCHEMY_CELO_API_KEY_URL) )

const uFactoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
const ROUTERADDRESS = web3.utils.toChecksumAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")

const usdAddress = "0xB42071eF8901912Cc92A59De04f6d49dd58a88A8"
const TESTTOKENADDRESS = web3.utils.toChecksumAddress("0xaEbAdA4742e65fc6Aa66fC890b105d0516EDBC18")

const uFactory = new web3.eth.Contract(IUniswapV2Factory.abi, uFactoryAddress)
const uRouter = new web3.eth.Contract(IUniswapV2Router02.abi, ROUTERADDRESS)
const OD_testToken = new web3.eth.Contract(IERC20.abi, TESTTOKENADDRESS)

const OD_testTokenAmount = web3.utils.toWei('1', 'Ether')
const OD_testToken_SELL_PRICE = web3.utils.toWei('2', 'Ether')
console.log("OD_testTokenAmount Amount", OD_testTokenAmount)

console.log("running");

async function sellOD_testToken(OD_testtoken, OD_USD) {
  let path = [TESTTOKENADDRESS,usdAddress];


  // Set Deadline 1 minute from now
  const moment = require('moment') 
  const now = moment().unix() // fetch current unix timestamp
  const DEADLINE = now + 60 // add 60 seconds
  console.log("Deadline", DEADLINE)

  // Perform Swap
  console.log("balance");

  let bal = await OD_testToken.methods.balanceOf(process.env.ACCOUNT).call()

  console.log(bal, "my sepolia balance of testToken");

  console.log("gas");

  console.log("approving");

  const gasApprove = await OD_testToken.methods.approve(ROUTERADDRESS, OD_testToken_SELL_PRICE).estimateGas({ from: process.env.ACCOUNT })

  console.log(gasApprove);

  await OD_testToken.methods.approve(ROUTERADDRESS, OD_testToken_SELL_PRICE).send({ from: process.env.ACCOUNT ,  gas: gasApprove  })

  console.log('Performing swap...')
  const gas = await uRouter.methods.swapExactTokensForTokens(OD_testtoken,OD_USD,path, otherAccount, DEADLINE).estimateGas({ from: process.env.ACCOUNT })
  await uRouter.methods.swapExactTokensForTokens(OD_testtoken, OD_USD, path, otherAccount, DEADLINE).send({ from: process.env.ACCOUNT, gas: gas })

  console.log("finish swap");
  console.log(`Successful Swap: https://sepolia.etherscan.io/tx/${result.transactionHash}`)
}



sellOD_testToken(1, 1).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
