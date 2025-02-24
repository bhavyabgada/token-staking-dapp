# Token Staking DApp

A decentralized application for staking ERC-20 tokens with flexible lock-up periods and reward mechanisms.

## Features

- Stake ERC-20 tokens for various durations
- Earn rewards based on staking duration and amount
- Multiple staking periods with different reward multipliers
- Modern, responsive UI with real-time updates
- Secure smart contract implementation

## Tech Stack

- Frontend:
  - React with Next.js
  - TypeScript
  - Chakra UI
  - RainbowKit for wallet connection
  - React Query for data management
- Smart Contracts:
  - Solidity
  - Hardhat
  - OpenZeppelin contracts
  - Ethers.js

## Prerequisites

- Node.js 18 or later
- Docker and Docker Compose
- MetaMask or another Web3 wallet

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd token-staking-dapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development environment with Docker:
   ```bash
   docker-compose up -d
   ```

4. Deploy the contracts:
   ```bash
   docker-compose exec hardhat npx hardhat run scripts/deploy.ts --network localhost
   ```

5. Update the contract addresses in `constants/addresses.ts` with the deployed contract addresses.

6. Access the application at http://localhost:3000

## Smart Contracts

### StakingToken.sol
- ERC-20 token used for staking
- Implements standard token functionality with minting capability

### TokenStaking.sol
- Main staking contract
- Handles stake creation, reward calculation, and unstaking
- Configurable staking periods and reward multipliers
- Secure implementation with reentrancy protection

## Staking Periods

1. 30 days: 1x reward multiplier
2. 90 days: 1.5x reward multiplier
3. 180 days: 2x reward multiplier
4. 365 days: 3x reward multiplier

## Development

### Running Tests
```bash
npm run test-contracts
```

### Local Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## Docker Configuration

The project includes two Docker services:

1. Frontend Application (port 3000)
2. Local Hardhat Network (port 8545)

## Security Considerations

- Smart contracts use OpenZeppelin's secure implementations
- Reentrancy protection on critical functions
- Access control for administrative functions
- Thorough testing of reward calculations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License # token-staking-dapp
