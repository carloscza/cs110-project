
#!/bin/bash
clear

echo "🚀 Starting Trackboxd project..."

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env file not found!"
    echo "📝 Please create backend/.env file with:"
    echo "   MONGODB_URI=your_mongodb_connection_string"
    echo "   DB_NAME=trackboxdDB"
    echo "   PORT=3001"
    exit 1
fi

echo "✅ .env file found"

# Function to check if npm install is needed
check_npm_install() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir/node_modules" ]; then
        echo "📦 $name node_modules not found. Installing dependencies..."
        cd "$dir" && npm install
        if [ $? -ne 0 ]; then
            echo "❌ Failed to install $name dependencies"
            exit 1
        fi
        cd ..
        return
    fi
    
    # Check if package.json is newer than node_modules
    if [ "$dir/package.json" -nt "$dir/node_modules" ]; then
        echo "📦 $name package.json updated. Reinstalling dependencies..."
        cd "$dir" && npm install
        if [ $? -ne 0 ]; then
            echo "❌ Failed to install $name dependencies"
            exit 1
        fi
        cd ..
        return
    fi
    
    echo "✅ $name dependencies are up to date"
}

# Check backend dependencies
check_npm_install "backend" "Backend"

# Check frontend dependencies  
check_npm_install "frontend" "Frontend"

# Function to cleanup existing processes
cleanup_ports() {
    echo "🧹 Cleaning up existing processes..."
    
    # Kill any existing react-scripts processes
    pkill -f "react-scripts" 2>/dev/null || true
    
    # Kill any processes running on port 3000 and 3001
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    
    echo "✅ Cleanup complete"
}

# Cleanup before starting
cleanup_ports

echo "🔧 Starting backend and frontend..."

# Start backend in background and frontend in foreground
(cd backend && node index.js) &
cd frontend && npm start