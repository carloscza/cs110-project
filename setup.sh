#!/bin/bash

echo "🚀 Setting up Trackboxd project..."

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

echo "✅ Node.js and npm are installed on your mahcine."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found!"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Please create backend/.env file with your MongoDB credentials"
    echo "📝 Add the following to the .env file..."
    echo "   MONGODB_URI=your_mongodb_connection_string"
    echo "   DB_NAME=trackboxdDB"
    echo "   PORT=3001"
else
    echo "✅ .env file exists"
fi

echo "✅ Backend setup complete"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
if [ ! -f "package.json" ]; then
    echo "❌ Frontend package.json not found!"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend setup complete"

# Go back to project root
cd ..

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your MongoDB connection string"
echo ""
echo "2. Start the backend:  cd backend && node index.js"
echo "3. Start the frontend: cd frontend && npm start"
echo ""