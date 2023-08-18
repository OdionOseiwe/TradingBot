import { log } from "console";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

  const OD_USD = await ethers.deployContract("OD_USD");

  console.log('deploying')

  await OD_USD.waitForDeployment();

  console.log('deployed to', await OD_USD.getAddress());

  const OD_testToken = await ethers.deployContract("OD_testToken");

  console.log('deploying')

  await OD_testToken.waitForDeployment();

  console.log('deployed to', await OD_testToken.getAddress());

     
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

