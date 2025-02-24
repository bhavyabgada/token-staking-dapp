import { ethers } from "hardhat";

async function main() {
  const stakingTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // First test account
  const amount = ethers.utils.parseEther("1000"); // 1000 tokens

  // Get the StakingToken contract
  const StakingToken = await ethers.getContractFactory("StakingToken");
  const stakingToken = StakingToken.attach(stakingTokenAddress);

  // Transfer tokens to the user
  await stakingToken.transfer(userAddress, amount);
  console.log(`Transferred ${ethers.utils.formatEther(amount)} tokens to ${userAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 