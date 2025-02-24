#!/bin/sh

# Exit on error
set -e

# Wait for environment to be ready (if needed)
echo "Checking environment..."

# Run the application
case "$1" in
  "dev")
    echo "Starting in development mode..."
    npm run dev
    ;;
  "prod")
    echo "Starting in production mode..."
    npm run start
    ;;
  *)
    echo "Starting in default mode (production)..."
    npm run start
    ;;
esac 