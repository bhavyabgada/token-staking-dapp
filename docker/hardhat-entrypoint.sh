#!/bin/sh

# Exit on error
set -e

# Start Hardhat node
echo "Starting Hardhat node..."
npx hardhat node --network hardhat --hostname 0.0.0.0 --port 8545 &

# Wait for the node to start
sleep 5

# Deploy contracts if AUTO_DEPLOY is set to true
if [ "$AUTO_DEPLOY" = "true" ]; then
    echo "Deploying contracts..."
    npx hardhat run scripts/deploy.ts --network localhost
    
    # Store contract addresses for the frontend
    echo "Storing contract addresses..."
    mkdir -p /app/shared
    npx hardhat run scripts/export-addresses.ts --network localhost
fi

# Keep container running
tail -f /dev/null 