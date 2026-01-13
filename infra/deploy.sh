#!/bin/bash
set -e

# Kideo Deployment Script
# Usage: ./deploy.sh [--build] [--migrate]

BUILD=false
MIGRATE=false

for arg in "$@"; do
    case $arg in
        --build)
            BUILD=true
            shift
            ;;
        --migrate)
            MIGRATE=true
            shift
            ;;
    esac
done

echo "==> Deploying Kideo..."

# Pull latest code
echo "==> Pulling latest changes..."
git pull origin main

# Build if requested
if [ "$BUILD" = true ]; then
    echo "==> Building Docker images..."
    docker compose build --no-cache
fi

# Run migrations if requested
if [ "$MIGRATE" = true ]; then
    echo "==> Running database migrations..."
    docker build --target migrator -t kideo-migrator -f apps/web/Dockerfile .
    docker run --rm --env-file .env kideo-migrator sh -c "cd packages/db && npx prisma migrate deploy"
fi

# Restart services
echo "==> Restarting services..."
docker compose up -d

echo "==> Deployment complete!"
echo "==> Check logs with: docker compose logs -f"
