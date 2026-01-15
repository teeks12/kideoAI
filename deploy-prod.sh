#!/bin/bash
set -e

# Kideo Production Deployment Script
# Usage: ./deploy-prod.sh [--build] [--migrate]

echo "🚀 Deploying Kideo to Production..."

# Parse arguments
BUILD_FLAG=""
MIGRATE_FLAG=""

for arg in "$@"; do
    case $arg in
        --build)
            BUILD_FLAG="--build"
            ;;
        --migrate)
            MIGRATE_FLAG="--migrate"
            ;;
    esac
done

# Push latest code to GitHub
echo "📦 Pushing latest code to GitHub..."
git push origin main

# Deploy to server
echo "🌐 Deploying to kideo-prod server..."
ssh kideo-prod "cd kideoAI && ./infra/deploy.sh $BUILD_FLAG $MIGRATE_FLAG"

echo ""
echo "✅ Deployment complete!"
echo "🌍 Visit: https://kideo.ai"
echo ""
echo "💡 Tips:"
echo "   - View logs: ssh kideo-prod 'cd kideoAI && docker compose logs -f web'"
echo "   - Check status: ssh kideo-prod 'cd kideoAI && docker compose ps'"
