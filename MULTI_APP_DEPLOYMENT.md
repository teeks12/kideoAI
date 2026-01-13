# Multi-App Deployment on Hetzner

Guide for running multiple applications on a single Hetzner server.

## Strategy Overview

You have several options for running multiple apps on one Hetzner server:

### Option 1: Multiple Apps with Caddy (Recommended)
**Best for:** 2-5 small to medium apps on one server

**Setup:**
- One Caddy instance as main reverse proxy
- Each app runs on different internal ports
- Caddy routes by domain/subdomain

**Pros:**
- Simple setup
- Shared SSL certificate management
- Cost-effective (~€8/month for CX32)

**Cons:**
- Apps share resources
- One app can affect others if it crashes

---

### Option 2: Docker Compose with Multiple Projects
**Best for:** Multiple related services/microservices

**Setup:**
- Each project has its own docker-compose.yml
- Projects can share networks and volumes
- Caddy manages all routing

**Pros:**
- Isolated deployments
- Independent scaling
- Shared infrastructure

---

### Option 3: Separate Servers per App
**Best for:** Production apps that need isolation

**Setup:**
- Each app on its own Hetzner server
- Complete isolation

**Pros:**
- Full isolation
- Independent scaling
- No resource conflicts

**Cons:**
- Higher cost (€4-8 per app per month)

---

## Implementation: Option 1 - Multi-App with Caddy

### Server Requirements

For multiple apps, upgrade to:
- **CX32**: 4 vCPU, 8GB RAM - €7.77/month (3-5 small apps)
- **CX42**: 8 vCPU, 16GB RAM - €15.30/month (5-10 small apps)

### Directory Structure

```
/root/
├── apps/
│   ├── kideo/           (your current app)
│   │   ├── docker-compose.yml
│   │   ├── .env
│   │   └── ...
│   ├── other-app/
│   │   ├── docker-compose.yml
│   │   ├── .env
│   │   └── ...
│   └── another-app/
│       ├── docker-compose.yml
│       ├── .env
│       └── ...
└── caddy/
    ├── Caddyfile
    └── docker-compose.yml
```

### Step 1: Set Up Main Caddy Proxy

Create `/root/caddy/docker-compose.yml`:

```yaml
version: "3.8"

services:
  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - web
    restart: unless-stopped

networks:
  web:
    external: true

volumes:
  caddy_data:
  caddy_config:
```

Create `/root/caddy/Caddyfile`:

```
# Kideo App
kideo.ai {
    reverse_proxy kideo:3000
}

www.kideo.ai {
    redir https://kideo.ai{uri}
}

# Other App Example
otherapp.com {
    reverse_proxy otherapp:3000
}

# Subdomain Example
api.myapp.com {
    reverse_proxy myapp-api:8080
}

# Admin Panel Example
admin.kideo.ai {
    reverse_proxy kideo-admin:4000
}
```

### Step 2: Create Shared Docker Network

```bash
docker network create web
```

### Step 3: Update App docker-compose.yml Files

For each app, modify `docker-compose.yml`:

**Before (Kideo example):**
```yaml
services:
  web:
    build: ...
    ports:
      - "3000:3000"  # Remove this
```

**After:**
```yaml
services:
  web:
    build: ...
    container_name: kideo  # Add this
    networks:
      - web
    # Remove ports section

networks:
  web:
    external: true
```

**Key changes:**
1. Add `container_name` matching the name in Caddyfile
2. Add to `web` network
3. Remove port mappings (no external ports needed)
4. Add external network reference

### Step 4: Deploy Apps

```bash
# Start Caddy first
cd /root/caddy
docker compose up -d

# Deploy Kideo
cd /root/apps/kideo
docker compose up -d

# Deploy other apps
cd /root/apps/other-app
docker compose up -d
```

### Step 5: Verify Routing

```bash
# Check all containers are on web network
docker network inspect web

# Test routing
curl -I https://kideo.ai
curl -I https://otherapp.com
```

---

## Template: New App Deployment

### Quick Start Script

Create `/root/deploy-new-app.sh`:

```bash
#!/bin/bash

# Usage: ./deploy-new-app.sh myapp myapp.com 3000

APP_NAME=$1
DOMAIN=$2
PORT=$3

echo "==> Setting up $APP_NAME"

# Create app directory
mkdir -p /root/apps/$APP_NAME
cd /root/apps/$APP_NAME

# Clone or create your app here
# git clone https://github.com/you/$APP_NAME.git .

# Add to Caddy config
cat >> /root/caddy/Caddyfile <<EOF

$DOMAIN {
    reverse_proxy $APP_NAME:$PORT
}
EOF

# Reload Caddy
cd /root/caddy
docker compose restart caddy

echo "==> $APP_NAME setup complete"
echo "==> Deploy your app with: cd /root/apps/$APP_NAME && docker compose up -d"
```

Make it executable:
```bash
chmod +x /root/deploy-new-app.sh
```

### Usage

```bash
./deploy-new-app.sh myapp myapp.com 3000
```

---

## Resource Management

### Monitor Resource Usage

```bash
# Overall system resources
htop

# Docker container resources
docker stats

# Disk usage
df -h
docker system df
```

### Limit App Resources

In each app's `docker-compose.yml`:

```yaml
services:
  web:
    image: ...
    deploy:
      resources:
        limits:
          cpus: '1.0'      # Max 1 CPU
          memory: 1024M     # Max 1GB RAM
        reservations:
          cpus: '0.25'      # Guaranteed 0.25 CPU
          memory: 256M      # Guaranteed 256MB RAM
```

### Cleanup Unused Resources

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove everything unused
docker system prune -a --volumes
```

---

## Database Strategy for Multiple Apps

### Option A: Separate Databases (Recommended)

Each app uses its own Neon database:

```
App 1 → Neon DB 1
App 2 → Neon DB 2
App 3 → Neon DB 3
```

**Pros:**
- Isolation
- Independent backups
- Neon free tier per DB

### Option B: Single PostgreSQL Container

Run one Postgres container for all apps:

```yaml
# /root/infrastructure/docker-compose.yml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - web
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  web:
    external: true
```

Each app connects to:
```
DATABASE_URL=postgresql://user:pass@postgres:5432/app1_db
DATABASE_URL=postgresql://user:pass@postgres:5432/app2_db
```

**Pros:**
- Lower cost
- Faster queries (local)

**Cons:**
- Single point of failure
- Need to manage backups
- More complex

---

## Complete Example: Adding a Second App

Let's say you want to add a blog app alongside Kideo.

### 1. Update Caddy

Edit `/root/caddy/Caddyfile`:

```
# Existing Kideo
kideo.ai {
    reverse_proxy kideo:3000
}

# New blog
blog.kideo.ai {
    reverse_proxy blog:3000
}
```

Restart Caddy:
```bash
cd /root/caddy
docker compose restart caddy
```

### 2. Deploy Blog App

```bash
mkdir -p /root/apps/blog
cd /root/apps/blog

# Clone your blog repo
git clone https://github.com/yourusername/blog.git .

# Create .env
nano .env
```

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  blog:
    build: .
    container_name: blog
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    networks:
      - web
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  web:
    external: true
```

Deploy:
```bash
docker compose up -d
```

### 3. Update DNS

Add DNS record:
```
Type: CNAME
Name: blog
Value: kideo.ai
TTL: 300
```

### 4. Test

```bash
curl -I https://blog.kideo.ai
```

---

## Maintenance Scripts

### Global Deployment Script

Create `/root/deploy-all.sh`:

```bash
#!/bin/bash

echo "==> Deploying all apps..."

for app in /root/apps/*; do
    if [ -d "$app" ]; then
        echo "==> Deploying $(basename $app)..."
        cd "$app"
        git pull origin main
        docker compose up -d --build
    fi
done

echo "==> Restarting Caddy..."
cd /root/caddy
docker compose restart caddy

echo "==> All deployments complete"
```

### Health Check Script

Create `/root/check-health.sh`:

```bash
#!/bin/bash

echo "==> Checking all apps..."

# Check Caddy
echo "Caddy:"
docker compose -f /root/caddy/docker-compose.yml ps

# Check each app
for app in /root/apps/*; do
    if [ -d "$app" ]; then
        echo ""
        echo "$(basename $app):"
        cd "$app"
        docker compose ps
    fi
done

# Check resource usage
echo ""
echo "System Resources:"
docker stats --no-stream
```

---

## Cost Comparison

### Single Server Multi-App

**CX32 Server (4 vCPU, 8GB RAM): €7.77/month**
- Kideo
- Blog
- API service
- Admin panel
- Landing page

**Total: €7.77/month for 5 apps**

### Separate Servers

**5 x CX22 Servers: €20.75/month**
- More isolation
- Independent scaling
- Higher availability

---

## When to Upgrade/Split

**Upgrade to larger server when:**
- CPU usage consistently > 70%
- Memory usage > 80%
- Slow response times
- Need more than 5 small apps

**Split to multiple servers when:**
- One app needs significant resources
- Need high availability
- Apps have different update schedules
- Security isolation required

---

## Recommended Setup for You

Based on your needs:

**Now (1 app):**
- CX22 (2 vCPU, 4GB RAM) - €4.15/month
- Current single-app setup

**Later (2-4 apps):**
- CX32 (4 vCPU, 8GB RAM) - €7.77/month
- Multi-app Caddy setup
- Shared infrastructure

**Future (5+ apps or high traffic):**
- Multiple CX22/CX32 servers
- One app per server or grouped by purpose
- Load balancing with Hetzner Load Balancer

---

## Next Steps

1. Deploy Kideo first (using DEPLOYMENT.md)
2. Test and stabilize
3. When you add a second app:
   - Upgrade to CX32
   - Implement multi-app Caddy setup
   - Follow "Adding a Second App" guide above
