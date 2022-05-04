import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Staking", function () {
  it("Should deploy and setup staking contract", async function () {
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
  
    await token.connect(signers[0]).approve(stake.address, ethers.utils.parseEther('1000000000'));
    await token.connect(signers[1]).approve(stake.address, ethers.utils.parseEther('1000'));
    await token.connect(signers[2]).approve(stake.address, ethers.utils.parseEther('1000'));
    await token.connect(signers[3]).approve(stake.address, ethers.utils.parseEther('1000'));
    await token.connect(signers[4]).approve(stake.address, ethers.utils.parseEther('1000'));
  
    await stake.fundContract(ethers.utils.parseEther('10000000'));
  
    console.log("Staking deployed to:", stake.address);
    console.log("Staking has balance of:", ethers.utils.formatEther(await token.balanceOf(stake.address)));
  
    await stake.connect(signers[1]).stake(ethers.utils.parseEther('1000'));
    await stake.connect(signers[2]).stake(ethers.utils.parseEther('1000'));
    await stake.connect(signers[3]).stake(ethers.utils.parseEther('1000'));
    await stake.connect(signers[4]).stake(ethers.utils.parseEther('1000'));
  
    console.log("Staking has total staked:", ethers.utils.formatEther(await stake.totalSupply()));

    console.log(await stake.rewardRate());
    console.log(await stake.getRewardForDuration());
    console.log(await stake.rewardPerToken());

    // Increase by a month - a day
    await ethers.provider.send("evm_increaseTime", [2628000 - 86400]);
    await ethers.provider.send('evm_mine', []);

    await stake.fundContract(ethers.utils.parseEther('100'))

    // Increase by a year
    await ethers.provider.send("evm_increaseTime", [2628000 * 12 + 1000]);
    await ethers.provider.send('evm_mine', []);

    const addr1Earned = Number(ethers.utils.formatEther(await stake.earned(signers[1].address)));
    const addr2Earned = Number(ethers.utils.formatEther(await stake.earned(signers[2].address)));
    const addr3Earned = Number(ethers.utils.formatEther(await stake.earned(signers[3].address)));
    const addr4Earned = Number(ethers.utils.formatEther(await stake.earned(signers[4].address)));

    console.log("Address 1 has earned:", ethers.utils.formatEther(await stake.earned(signers[1].address)));
    console.log("Address 2 has earned:", ethers.utils.formatEther(await stake.earned(signers[2].address)));
    console.log("Address 3 has earned:", ethers.utils.formatEther(await stake.earned(signers[3].address)));
    console.log("Address 4 has earned:", ethers.utils.formatEther(await stake.earned(signers[4].address)));

    // Test all rewards given out
    expect(Math.round(addr1Earned + addr2Earned + addr3Earned + addr4Earned)).to.equal(10000100);

    await stake.connect(signers[1]).exit();
    await stake.connect(signers[2]).exit();
    await stake.connect(signers[3]).exit();
    await stake.connect(signers[4]).exit();

    // Test claim and exit
    expect(addr1Earned + 1000).to.equal(Number(ethers.utils.formatEther(await token.balanceOf(signers[1].address))));
    expect(addr2Earned + 1000).to.equal(Number(ethers.utils.formatEther(await token.balanceOf(signers[2].address))));
    expect(addr3Earned + 1000).to.equal(Number(ethers.utils.formatEther(await token.balanceOf(signers[3].address))));
    expect(addr4Earned + 1000).to.equal(Number(ethers.utils.formatEther(await token.balanceOf(signers[4].address))));
  });
});
