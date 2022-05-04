// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

const ROPSTEN_WBTC = "0x65058d7081FCdC3cd8727dbb7F8F9D52CefDd291";
const ROPSTEN_SATS = "0xda16d170636fdf07428d9632cb5ea2a9c6097dc1";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const signers: SignerWithAddress[] = await ethers.getSigners();

  // We get the contract to deploy
  const Stake = await ethers.getContractFactory('StandardStake');
  const stake = await Stake.deploy(
    signers[0].address,
    ROPSTEN_WBTC,
    ROPSTEN_SATS,
    30
  );

  await stake.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
