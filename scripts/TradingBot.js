require('dotenv').config()
const Web3 = require('web3');
var Contract = require('web3-eth-contract');
const moment = require('moment-timezone')
const web3 = new Web3("https://celo-alfajores.infura.io/v3/e7af8fc766b941c498bc770af5246568");
const IUniswapV2Factory = require("@uniswap/v2-core/build/IUniswapV2Factory.json");
const IUniswapV2Router02 = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json');
const IUniswapV2Pair = require('@uniswap/v2-core/build/IUniswapV2Pair.json')
const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')

// const signer = web3.eth.accounts.privateKeyToAccount(privateKey);

const uFactoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
const uRouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

const uFactory = new web3.eth.Contract(IUniswapV2Factory.abi, uFactoryAddress)
const uRouter = new web3.eth.Contract(IUniswapV2Router02.abi, uRouterAddress)
const OD_testToken = new web3.eth.Contract(IERC20.abi, "")

const OD_testTokenAmount = web3.utils.toWei('1', 'Ether')
const OD_testToken_SELL_PRICE = web3.utils.toWei('2', 'Ether')
console.log("OD_testTokenAmount Amount", OD_testTokenAmount)

console.log("runing");

async function sellOD_testToken(OD_testToken, OD_USD) {
  // Set Deadline 1 minute from now
  const moment = require('moment') // import moment.js library
  const now = moment().unix() // fetch current unix timestamp
  const DEADLINE = now + 60 // add 60 seconds
  console.log("Deadline", DEADLINE)

  // Transaction Settings
  const SETTINGS = {
    gasLimit: 8000000, // Override gas settings: https://github.com/ethers-io/ethers.js/issues/469
    gasPrice: web3.utils.toWei('50', 'Gwei'),
    from: process.env.ACCOUNT , // Use your account here
  }

  // Perform Swap
  console.log('Performing swap...')
  let result = await uRouter.methods.swapExactTokensForTokens(OD_testToken,OD_USD,[address, adddress], process.env.ACCOUNT, DEADLINE).send(SETTINGS)
  console.log(`Successful Swap: https://goerli.etherscan.io/tx/${result.transactionHash}`)
}



sellOD_testToken(1, 1).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
