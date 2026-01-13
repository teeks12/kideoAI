#!/bin/bash
set -e

# Kideo Server Setup Script
# Run this on a fresh Ubuntu 22.04/24.04 server (Hetzner, DigitalOcean, etc.)

echo "==> Updating system packages..."
sudo apt update && sudo apt upgrade -y

echo "==> Installing Docker..."
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

echo "==> Installing Docker Compose..."
sudo apt install -y docker-compose-plugin

echo "==> Installing Git..."
sudo apt install -y git

echo "==> Creating app directory..."
sudo mkdir -p /opt/kideo
sudo chown $USER:$USER /opt/kideo

echo "==> Setup complete!"
echo ""
echo "Next steps:"
echo "1. Log out and back in (for Docker group)"
echo "2. Clone your repository:"
echo "   cd /opt/kideo && git clone https://github.com/YOUR_USERNAME/kideo.git ."
echo ""
echo "3. Create .env file:"
echo "   cp .env.example .env"
echo "   nano .env  # Add your production values"
echo ""
echo "4. Point your domain (kideo.ai) DNS A record to this server's IP"
echo ""
echo "5. Deploy:"
echo "   ./infra/deploy.sh --build --migrate"
