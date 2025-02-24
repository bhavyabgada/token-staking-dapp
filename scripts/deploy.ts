import { ethers } from "hardhat";

async function main() {
  // Deploy StakingToken
  const StakingToken = await ethers.getContractFactory("StakingToken");
  const stakingToken = await StakingToken.deploy();
  await stakingToken.deployed();
  console.log("StakingToken deployed to:", stakingToken.address);

  // Deploy RewardToken (using StakingToken contract as it's also an ERC20)
  const RewardToken = await ethers.getContractFactory("StakingToken");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.deployed();
  console.log("RewardToken deployed to:", rewardToken.address);

  // Deploy TokenStaking
  const TokenStaking = await ethers.getContractFactory("TokenStaking");
  const tokenStaking = await TokenStaking.deploy(stakingToken.address, rewardToken.address);
  await tokenStaking.deployed();
  console.log("TokenStaking deployed to:", tokenStaking.address);

  // Transfer some reward tokens to the staking contract
  const rewardAmount = ethers.utils.parseEther("100000"); // 100,000 tokens
  await rewardToken.transfer(tokenStaking.address, rewardAmount);
  console.log("Transferred reward tokens to staking contract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 