// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const signers: SignerWithAddress[] = await ethers.getSigners();

  const Token = await ethers.getContractFactory('TestToken');
  const token = await Token.deploy('1000000000000000000000000000');

  await token.deployed();

  await token.transfer(signers[1].address, ethers.utils.parseEther('1000'));
  await token.transfer(signers[2].address, ethers.utils.parseEther('1000'));
  await token.transfer(signers[3].address, ethers.utils.parseEther('1000'));
  await token.transfer(signers[4].address, ethers.utils.parseEther('1000'));

  // We get the contract to deploy
  const Stake = await ethers.getContractFactory('StandardStake');
  const stake = await Stake.deploy(
    signers[0].address,
    token.address,
    token.address,
    365
  );

  await stake.deployed();

  await token.connect(signers[0]).approve(stake.address, ethers.utils.parseEther('10000000'));
  await token.connect(signers[1]).approve(stake.address, ethers.utils.parseEther('1000'));
  await token.connect(signers[2]).approve(stake.address, ethers.utils.parseEther('1000'));
  await token.connect(signers[3]).approve(stake.address, ethers.utils.parseEther('1000'));
  await token.connect(signers[4]).approve(stake.address, ethers.utils.parseEther('1000'));

  await stake.fundContract(ethers.utils.parseEther('10000000'));

  console.log("Staking deployed to:", stake.address);
  console.log("Staking has balance of:", await token.balanceOf(stake.address));

  await stake.connect(signers[1]).stake(ethers.utils.parseEther('1000'));
  await stake.connect(signers[2]).stake(ethers.utils.parseEther('1000'));
  await stake.connect(signers[3]).stake(ethers.utils.parseEther('1000'));
  await stake.connect(signers[4]).stake(ethers.utils.parseEther('1000'));

  console.log("Staking has total staked:", ethers.utils.formatEther(await stake.totalSupply()));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
