#!/bin/bash
clear

echo "🚀 Setting up Trackboxd project..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install backend dependencies
echo "⚙️ Setting up Backend..."
cd backend
if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found!"
    exit 1
fi

echo "📦 Installing backend dependencies..."
npm_output=$(npm install 2>&1)
npm_exit_code=$?

if [ $npm_exit_code -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    echo "$npm_output"
    exit 1
fi

# Extract key info from npm output
packages=$(echo "$npm_output" | grep "audited" | head -1)
vulnerabilities=$(echo "$npm_output" | grep "vulnerabilities" | head -1)

if [[ $packages ]]; then
    echo "   ✅ $packages"
fi
if [[ $vulnerabilities ]]; then
    echo "   ⚠️  $vulnerabilities"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Please create backend/.env file with your MongoDB credentials"
    echo "📝 Add the following to the .env file..."
    echo "   MONGODB_URI=your_mongodb_connection_string"
    echo "   DB_NAME=trackboxdDB"
    echo "   PORT=3001"
fi

echo ""

# Install frontend dependencies
echo "⚙️ Setting up Frontend..."
cd ../frontend
if [ ! -f "package.json" ]; then
    echo "❌ Frontend package.json not found!"
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm_output=$(npm install 2>&1)
npm_exit_code=$?

if [ $npm_exit_code -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    echo "$npm_output"
    exit 1
fi

# Extract and display key info
packages=$(echo "$npm_output" | grep "audited" | head -1)
vulnerabilities=$(echo "$npm_output" | grep "vulnerabilities" | head -1)
warnings=$(echo "$npm_output" | grep -c "npm WARN EBADENGINE")

if [[ $packages ]]; then
    echo "   ✅ $packages"
fi
if [[ $warnings -gt 0 ]]; then
    echo "   ⚠️  $warnings engine compatibility warnings (Node.js version)"
fi
if [[ $vulnerabilities ]]; then
    echo "   ⚠️  $vulnerabilities"
fi

echo ""

# Go back to project root
cd ..

# Make start script executable
chmod +x start.sh

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env file with your MongoDB connection string."
echo ""
echo "To run project execute start script:"
echo "./start.sh"
echo ""