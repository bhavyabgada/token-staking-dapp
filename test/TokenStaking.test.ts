import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { StakingToken, TokenStaking } from "../typechain-types";

describe("TokenStaking", function () {
  let stakingToken: StakingToken;
  let rewardToken: StakingToken;
  let tokenStaking: TokenStaking;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let addrs: SignerWithAddress[];

  beforeEach(async function () {
    // Get signers
    [owner, user, ...addrs] = await ethers.getSigners();

    // Deploy StakingToken
    const StakingToken = await ethers.getContractFactory("StakingToken");
    stakingToken = await StakingToken.deploy();
    await stakingToken.deployed();

    // Deploy RewardToken
    rewardToken = await StakingToken.deploy();
    await rewardToken.deployed();

    // Deploy TokenStaking
    const TokenStaking = await ethers.getContractFactory("TokenStaking");
    tokenStaking = await TokenStaking.deploy(stakingToken.address, rewardToken.address);
    await tokenStaking.deployed();

    // Transfer some tokens to the user for testing
    await stakingToken.transfer(user.address, ethers.utils.parseEther("1000"));
    await rewardToken.transfer(tokenStaking.address, ethers.utils.parseEther("10000"));
  });

  describe("Staking", function () {
    it("Should allow users to stake tokens", async function () {
      const stakeAmount = ethers.utils.parseEther("100");
      const periodIndex = 0; // 30 days

      // Approve tokens
      await stakingToken.connect(user).approve(tokenStaking.address, stakeAmount);

      // Stake tokens
      await tokenStaking.connect(user).stake(stakeAmount, periodIndex);

      // Get user stakes
      const stakes = await tokenStaking.getStakes(user.address);
      
      expect(stakes.length).to.equal(1);
      expect(stakes[0].amount).to.equal(stakeAmount);
      expect(stakes[0].periodIndex).to.equal(periodIndex);
      expect(stakes[0].active).to.be.true;
    });

    it("Should calculate rewards correctly", async function () {
      const stakeAmount = ethers.utils.parseEther("100");
      const periodIndex = 0; // 30 days

      // Approve and stake tokens
      await stakingToken.connect(user).approve(tokenStaking.address, stakeAmount);
      await tokenStaking.connect(user).stake(stakeAmount, periodIndex);

      // Fast forward time (15 days)
      await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      // Get user stakes
      const stakes = await tokenStaking.getStakes(user.address);
      const reward = await tokenStaking.calculateReward(stakes[0]);

      // Reward should be greater than 0 but less than full reward
      expect(reward).to.be.gt(0);
      expect(reward).to.be.lt(stakeAmount.mul(10).div(100)); // Less than 10% APY
    });

    it("Should allow users to unstake tokens and receive rewards", async function () {
      const stakeAmount = ethers.utils.parseEther("100");
      const periodIndex = 0; // 30 days

      // Approve and stake tokens
      await stakingToken.connect(user).approve(tokenStaking.address, stakeAmount);
      await tokenStaking.connect(user).stake(stakeAmount, periodIndex);

      // Fast forward time (30 days)
      await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      // Get initial balances
      const initialStakingBalance = await stakingToken.balanceOf(user.address);
      const initialRewardBalance = await rewardToken.balanceOf(user.address);

      // Unstake
      await tokenStaking.connect(user).unstake(0);

      // Check balances after unstaking
      const finalStakingBalance = await stakingToken.balanceOf(user.address);
      const finalRewardBalance = await rewardToken.balanceOf(user.address);

      expect(finalStakingBalance).to.equal(initialStakingBalance.add(stakeAmount));
      expect(finalRewardBalance).to.be.gt(initialRewardBalance);
    });
  });

  describe("Admin functions", function () {
    it("Should allow owner to set base APY", async function () {
      const newAPY = 1500; // 15%
      await tokenStaking.setBaseAPY(newAPY);
      expect(await tokenStaking.baseAPY()).to.equal(newAPY);
    });

    it("Should allow owner to add staking period", async function () {
      const duration = 60 * 24 * 60 * 60; // 60 days
      const multiplier = 125; // 1.25x
      await tokenStaking.addStakingPeriod(duration, multiplier);

      const period = await tokenStaking.stakingPeriods(4); // Index 4 as we already have 4 periods
      expect(period.duration).to.equal(duration);
      expect(period.rewardMultiplier).to.equal(multiplier);
    });
  });
}); 