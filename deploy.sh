#!/bin/bash

# PWP Fleet Management System Deployment Script

echo "Deploying PWP Fleet Management System..."

# Check if running as root (required for some operations)
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or with sudo"
  exit 1
fi

# Update system packages
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install Node.js if not already installed
if ! command -v node &> /dev/null; then
  echo "Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
  apt-get install -y nodejs
fi

# Install PM2 for process management
echo "Installing PM2..."
npm install -g pm2

# Navigate to project directory
cd /path/to/pwp

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install --production

# Build frontend
echo "Building frontend..."
cd ../frontend
npm install
npm run build

# Copy frontend build to backend public directory
echo "Copying frontend build to backend..."
mkdir -p ../backend/public
cp -r dist/* ../backend/public/

# Start backend with PM2
echo "Starting backend server with PM2..."
cd ../backend
pm2 start server.js --name "pwp-backend" --env production

# Save PM2 configuration
pm2 save

# Configure PM2 to start on system boot
pm2 startup

echo "Deployment complete! The application is now running."
echo "You can access it at http://your-server-ip:5000"
echo "To monitor the application, use: pm2 status"