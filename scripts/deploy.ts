// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
const SATS = "0xa010e37405Eb57437a381DAAE88e5C3913D0796C";
const OWNER = "0x1062B63F8F4b51363C748b8ABeCCD49A9d21fB85";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Stake = await ethers.getContractFactory('SatoshiBankStake');
  const stake = await Stake.deploy(
    OWNER,
    WBTC,
    SATS,
    30
  );

  await stake.deployed();

  console.log("Staking contract deployed to:", stake.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
