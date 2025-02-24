# 🚀 Token Staking DApp - 2040 Edition

[![Version](https://img.shields.io/badge/version-2.0-blue.svg)](https://github.com/bhavyabgada/token-staking-dapp)  
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)  
[![Platform](https://img.shields.io/badge/platform-Ethereum-purple.svg)](https://ethereum.org)

_A futuristic decentralized application for staking ERC-20 tokens with flexible lock-up periods and dynamic reward mechanisms._

---

## 📚 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Smart Contracts](#smart-contracts)
- [Docker Configuration](#docker-configuration)
- [Development](#development)
- [Contributing](#contributing)
- [Notices & Cautions](#notices--cautions)
- [Developer Philosophy](#developer-philosophy)
- [License](#license)

---

## 🔍 Overview

**Token Staking DApp** is a next-generation decentralized application that empowers users to stake ERC-20 tokens with flexible lock-up periods and earn rewards based on the duration and amount staked. Featuring a sleek, responsive UI and bulletproof smart contracts, this project is built for the visionary era of 2040. 😎✨

---

## 🌟 Features

- **Flexible Staking Durations:** Stake tokens for 30, 90, 180, or 365 days.
- **Dynamic Rewards:** Enjoy multipliers that increase your rewards based on the staking period.
- **Modern UI/UX:** Crafted using React, Next.js, and Chakra UI for an immersive experience.
- **Secure & Tested:** Smart contracts built with Solidity, Hardhat, and OpenZeppelin ensure maximum security. 🔒
- **Real-Time Data:** Powered by React Query for seamless, live updates.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React with Next.js
- **Language:** TypeScript
- **UI Library:** Chakra UI
- **Wallet Connection:** RainbowKit
- **State Management:** React Query

### Smart Contracts
- **Language:** Solidity
- **Development:** Hardhat, Ethers.js
- **Security:** OpenZeppelin Contracts

---

## 🏢 Architecture

### System Flow

```mermaid
flowchart TD
    A[User Interface<br/>(React/Next.js)] --> B[Wallet Connection<br/>(RainbowKit)]
    B --> C[Smart Contract Interaction<br/>(Ethers.js)]
    C --> D[Smart Contracts<br/>(Solidity/Hardhat)]
    D --> E[Staking Logic & Reward Calculation]
    E --> F[Blockchain Network<br/>(Local/Live)]
```

---

## ⚙️ Installation

### Prerequisites
- **Node.js** v18 or later
- **Docker** and **Docker Compose**
- **MetaMask** or another Web3 wallet

### Getting Started

1. **Clone the Repository**
    ```bash
    git clone https://github.com/bhavyabgada/token-staking-dapp.git
    cd token-staking-dapp
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Start the Development Environment**
    ```bash
    docker-compose up -d
    ```

4. **Deploy the Smart Contracts**
    ```bash
    docker-compose exec hardhat npx hardhat run scripts/deploy.ts --network localhost
    ```

5. **Configure Contract Addresses**
   - Update `constants/addresses.ts` with the deployed contract addresses.

6. **Launch the Application**
   - Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 🚀 Usage

After launching the application:

- **Connect** your wallet using RainbowKit.
- **Select a staking period** that suits your needs.
- **Stake your ERC-20 tokens** and watch your rewards grow in real-time.
- **Unstake tokens** once the lock-up period expires and enjoy your rewards. 🎉

---

## 📜 Smart Contracts

### Overview

The project includes two primary smart contracts:

- **StakingToken.sol**
  - Implements an ERC-20 token with minting capabilities for staking.

- **TokenStaking.sol**
  - Manages stake creation, reward calculations, and token unstaking.
  - Supports configurable staking periods with varying reward multipliers.
  - Incorporates robust security measures like reentrancy protection.

---

## 🐳 Docker Configuration

This project uses Docker to simplify development and testing:

- **Frontend Service:** Runs on port `3000`
- **Local Hardhat Network:** Runs on port `8545`

Ensure Docker is running before starting the services.

---

## 👨‍💻 Development

### Running Tests
Execute the smart contract tests:
```bash
npm run test-contracts
```

### Local Development Server
Launch the development server:
```bash
npm run dev
```

### Production Build
Build the project for production deployment:
```bash
npm run build
```

---

## 🤝 Contributing

We welcome contributions from fellow developers! Follow these steps to contribute:

1. **Fork the Repository**
2. **Create a Feature Branch**
3. **Commit Your Changes** with descriptive messages
4. **Push Your Branch**
5. **Open a Pull Request**

---

## ⚠️ Notices & Cautions

> **🚨 NOTICE:**  
> **Security is Paramount!**  
> All interactions with the blockchain and smart contracts are irreversible. Always double-check contract addresses, transaction details, and gas fees before proceeding.

> **Caution:**  
> - Test thoroughly on a local or test network before deploying to mainnet.  
> - Keep your private keys secure and never share them.  
> - This project is evolving—ensure you stay updated with the latest changes by following our repository.

---

## 💡 Developer Philosophy

We build for the future, combining high functionality with security and aesthetics. Join us in shaping the decentralized world! 🌐✨

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

© 2040 **Token Staking DApp** • Crafted with innovation, passion, and a futuristic vision. 😎🚀