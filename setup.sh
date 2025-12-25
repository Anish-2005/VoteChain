#!/bin/bash

echo "🚀 Setting up VoteChain - Blockchain Voting Platform"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js v16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version check passed: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Compile smart contracts
echo "🔨 Compiling smart contracts..."
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ Failed to compile smart contracts"
    exit 1
fi

echo "✅ Smart contracts compiled successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your RPC URLs and private keys"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Edit .env file with your blockchain network credentials"
echo "2. Run 'npm run node' to start local blockchain network"
echo "3. In another terminal, run 'npm run deploy:local' to deploy contracts"
echo "4. Run 'npm start' to start the frontend"
echo ""
echo "📖 For detailed instructions, see README.md"