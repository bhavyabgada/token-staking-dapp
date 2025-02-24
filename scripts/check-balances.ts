import { ethers } from "hardhat";

async function main() {
  const stakingTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const rewardTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const stakingContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // First test account

  // Get the contracts
  const StakingToken = await ethers.getContractFactory("StakingToken");
  const RewardToken = await ethers.getContractFactory("StakingToken");
  const TokenStaking = await ethers.getContractFactory("TokenStaking");

  const stakingToken = StakingToken.attach(stakingTokenAddress);
  const rewardToken = RewardToken.attach(rewardTokenAddress);
  const stakingContract = TokenStaking.attach(stakingContractAddress);

  // Get balances
  const stakingBalance = await stakingToken.balanceOf(userAddress);
  const rewardBalance = await rewardToken.balanceOf(userAddress);
  const stakes = await stakingContract.getStakes(userAddress);

  console.log("\nYour Balances:");
  console.log(`Staking Token (STK): ${ethers.utils.formatEther(stakingBalance)} tokens`);
  console.log(`Reward Token: ${ethers.utils.formatEther(rewardBalance)} tokens`);
  
  console.log("\nYour Stakes:");
  if (stakes.length === 0) {
    console.log("No active stakes");
  } else {
    for (let i = 0; i < stakes.length; i++) {
      const stake = stakes[i];
      if (stake.active) {
        const reward = await stakingContract.calculateReward(stake);
        console.log(`\nStake #${i}:`);
        console.log(`- Amount: ${ethers.utils.formatEther(stake.amount)} STK`);
        console.log(`- Staked on: ${new Date(stake.timestamp.toNumber() * 1000).toLocaleString()}`);
        console.log(`- Current reward: ${ethers.utils.formatEther(reward)} tokens`);
      }
    }
  }

  // Get staking periods
  console.log("\nAvailable Staking Periods:");
  for (let i = 0; i < 4; i++) {
    const period = await stakingContract.stakingPeriods(i);
    console.log(`Period #${i}:`);
    console.log(`- Duration: ${period.duration / (24 * 60 * 60)} days`);
    console.log(`- Reward multiplier: ${period.rewardMultiplier / 100}x`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 