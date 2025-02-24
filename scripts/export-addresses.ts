import fs from 'fs';
import path from 'path';

async function main() {
  // Read deployment artifacts
  const stakingTokenPath = path.join(__dirname, '../artifacts/contracts/StakingToken.sol/StakingToken.json');
  const tokenStakingPath = path.join(__dirname, '../artifacts/contracts/TokenStaking.sol/TokenStaking.json');
  
  const stakingToken = JSON.parse(fs.readFileSync(stakingTokenPath, 'utf8'));
  const tokenStaking = JSON.parse(fs.readFileSync(tokenStakingPath, 'utf8'));

  // Create addresses file content
  const content = `// These addresses are automatically updated after deployment
export const STAKING_TOKEN_ADDRESS = '${stakingToken.address}' as \`0x\${string}\`;
export const STAKING_CONTRACT_ADDRESS = '${tokenStaking.address}' as \`0x\${string}\`;
`;

  // Write to shared volume
  const sharedPath = path.join(__dirname, '../shared/addresses.ts');
  fs.writeFileSync(sharedPath, content);
  console.log('Contract addresses exported to shared volume');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 