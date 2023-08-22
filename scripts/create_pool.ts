
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
const OD_testTokenabi = require('./OD_testToken.json');

async function createPool() {
    console.log(`Preparing to create Uniswap pool...\n`)


    // WEB3 CONFIG
    const web3 = new Web3(new HDWalletProvider(process.env.ACCOUNT_PRIVATE_KEY, process.env.ALCHEMY_CELO_API_KEY_URL) )

    const uFactoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
    const ROUTERAddress = web3.utils.toChecksumAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
    
    const USDAddress = "0xB42071eF8901912Cc92A59De04f6d49dd58a88A8"
    const TESTTOKENAddress = web3.utils.toChecksumAddress("0xaEbAdA4742e65fc6Aa66fC890b105d0516EDBC18")
    
    const uFactory = new web3.eth.Contract(IUniswapV2Factory.abi, uFactoryAddress)
    const uRouter = new web3.eth.Contract(IUniswapV2Router02.abi, ROUTERAddress)
    const OD_testToken = new web3.eth.Contract(OD_testTokenabi.abi, TESTTOKENAddress)
    const OD_USD = new web3.eth.Contract(OD_USDabi.abi, USDAddress)


    const OD_testTokenAmount = web3.utils.toWei('20', 'Ether')
    const OD_USDAmount = web3.utils.toWei('20', 'Ether')

    console.log(OD_testTokenAmount, '...');
    

    console.log(`Approving OD_testtoken...`)

    await OD_testToken.methods.approve(ROUTERAddress, OD_testTokenAmount).send({ from: process.env.ACCOUNT })

    console.log(`Approving OD_USD...\n`)

    await OD_USD.methods.approve(ROUTERAddress, OD_USDAmount).send({ from: process.env.ACCOUNT })

    console.log(`Creating Uniswap pool...\n`)

    const gas = await uRouter.methods.addLiquidity(
        USDAddress,        
        TESTTOKENAddress,
        USDAddress,
        OD_testTokenAmount,
        USDAddress,
        OD_testTokenAmount,
        process.env.ACCOUNT,
        Math.floor(Date.now() / 1000) + 60 * 10
    ).estimateGas({ from: process.env.ACCOUNT })

    await uRouter.methods.addLiquidity(
        USDAddress,        
        TESTTOKENAddress,
        USDAddress,
        OD_testTokenAmount,
        USDAddress,
        OD_testTokenAmount,
        process.env.ACCOUNT,
        Math.floor(Date.now() / 1000) + 60 * 10
    ).send({ from: process.env.ACCOUNT, gas: gas })

    console.log(`Pool successfully created!\n`)

}

createPool().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});