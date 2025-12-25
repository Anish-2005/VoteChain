#!/bin/bash

# Repository Setup Script for VoteChain
# This script helps fix common repository naming and structure issues

echo "🗳️ VoteChain Repository Setup Helper"
echo "===================================="

# Check current directory name
CURRENT_DIR=$(basename "$PWD")
echo "Current directory: $CURRENT_DIR"

# Check if we're in the right place
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Check git remote
REMOTE_URL=$(git remote get-url origin 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "Current remote URL: $REMOTE_URL"
    
    # Check if remote URL has incorrect casing
    if [[ "$REMOTE_URL" == *"votechain"* ]]; then
        echo "⚠️  Warning: Remote URL contains 'votechain' (lowercase)"
        echo "Consider updating to 'VoteChain' for consistency"
        echo ""
        echo "To fix this, run:"
        echo "git remote set-url origin https://github.com/your-username/VoteChain.git"
    elif [[ "$REMOTE_URL" == *"VoteChain"* ]]; then
        echo "✅ Remote URL looks correct (VoteChain with proper casing)"
    fi
else
    echo "ℹ️  No git remote found"
fi

# Check project structure
echo ""
echo "📁 Checking project structure..."

REQUIRED_FILES=("package.json" "public/index.html" "src/index.js" "README.md")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    echo "✅ All required files present"
else
    echo "⚠️  Missing files detected. This may cause deployment issues."
fi

echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Ensure your GitHub repository is named 'VoteChain'"
echo "2. Push your changes: git add . && git commit -m 'Setup VoteChain' && git push"
echo "3. Deploy to Vercel with Framework Preset: Create React App"
