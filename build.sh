#!/bin/bash

# Build script for Vercel deployment
# This script ensures the build process can find all necessary files

echo "Starting VoteChain build process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Check if public/index.html exists
if [ ! -f "public/index.html" ]; then
    echo "Error: public/index.html not found."
    echo "Current directory: $(pwd)"
    echo "Files in current directory:"
    ls -la
    echo "Files in public directory (if exists):"
    ls -la public/ 2>/dev/null || echo "public directory not found"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

echo "Build completed successfully!"
