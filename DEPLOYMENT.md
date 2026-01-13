# Kideo Deployment Guide - Hetzner Cloud

Complete step-by-step guide to deploy Kideo on Hetzner Cloud.

## Prerequisites

- Domain name (e.g., kideo.ai)
- Neon PostgreSQL database (free tier available at neon.tech)
- Clerk account for authentication (free tier at clerk.com)
- Hetzner Cloud account

---

## Part 1: Set Up External Services

### 1.1 Neon PostgreSQL Setup

1. Go to https://neon.tech and sign up
2. Create a new project called "Kideo"
3. Copy your connection string (it looks like):
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. Save this - you'll need it for your `.env` file

### 1.2 Clerk Authentication Setup

1. Go to https://clerk.com and sign up
2. Create a new application called "Kideo"
3. In the dashboard, go to "API Keys"
4. Copy these values:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
5. Go to "Webhooks" and create a webhook endpoint
   - You'll set the URL later: `https://kideo.ai/api/webhooks/clerk`
   - Copy the `CLERK_WEBHOOK_SECRET`

---

## Part 2: Hetzner Cloud Setup

### 2.1 Create Hetzner Account

1. Go to https://www.hetzner.com/cloud
2. Click "Sign Up" and create an account
3. Verify your email
4. Add payment method (credit card or PayPal)
5. You may need to verify your identity for new accounts

### 2.2 Create a Cloud Project

1. Log in to Hetzner Cloud Console: https://console.hetzner.cloud
2. Click "New Project"
3. Name it "Kideo Production"
4. Click "Create Project"

### 2.3 Create a Server

1. Inside your project, click "Add Server"
2. **Choose Location**: Select a location close to your users
   - Nuremberg, Germany (eu-central)
   - Helsinki, Finland (eu-north)
   - Ashburn, USA (us-east)
3. **Choose Image**: Ubuntu 24.04
4. **Choose Type**:
   - **Standard** → CX22 (2 vCPU, 4GB RAM, 40GB SSD) - €4.15/month
   - This is perfect for starting out
5. **Networking**:
   - Leave IPv4 enabled
   - Enable IPv6 (optional)
6. **SSH Keys**:
   - Click "Add SSH Key"
   - If you don't have one, generate it on your Mac:
     ```bash
     ssh-keygen -t ed25519 -C "your_email@example.com"
     cat ~/.ssh/id_ed25519.pub
     ```
   - Copy the output and paste into Hetzner
   - Name it "MacBook"
7. **Cloud config**: Leave empty
8. **Name**: `kideo-prod-01`
9. Click "Create & Buy Now"

**Wait 1-2 minutes** for the server to be created.

### 2.4 Note Your Server IP

Once created, you'll see:
- **IPv4 Address**: `123.456.789.012` (example)
- Copy this IP - you'll need it for DNS and SSH

---

## Part 3: DNS Configuration

### 3.1 Configure Your Domain

Go to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.) and add these DNS records:

**For root domain (kideo.ai):**
```
Type: A
Name: @
Value: <your-server-ip>
TTL: 300
```

**For www subdomain:**
```
Type: A
Name: www
Value: <your-server-ip>
TTL: 300
```

**Example:**
```
A     @       123.456.789.012     300
A     www     123.456.789.012     300
```

**Note:** DNS propagation can take 5-60 minutes. You can check with:
```bash
dig kideo.ai
dig www.kideo.ai
```

---

## Part 4: Server Setup

### 4.1 Connect to Your Server

From your Mac terminal:

```bash
ssh root@<your-server-ip>
```

Example:
```bash
ssh root@123.456.789.012
```

Type "yes" when asked about authenticity.

### 4.2 Run Initial Setup Script

Once connected, run these commands:

```bash
# Clone your repository
git clone https://github.com/teeks12/kideoAI.git
cd kideoAI

# Make setup script executable
chmod +x infra/setup-server.sh

# Run the setup script
./infra/setup-server.sh
```

This will install:
- Docker & Docker Compose
- Git
- Fail2ban (security)
- UFW firewall (allows ports 22, 80, 443)

**This takes 3-5 minutes.**

### 4.3 Create Environment File

Still on the server, create your `.env` file:

```bash
nano .env
```

Paste this content (replace with your actual values):

```env
# Database (from Neon)
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# Clerk Authentication (from Clerk dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# URLs - REPLACE kideo.ai with YOUR domain
NEXT_PUBLIC_APP_URL=https://kideo.ai
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Environment
NODE_ENV=production
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter`

---

## Part 5: Deploy the Application

### 5.1 Update Caddy Configuration

Edit the Caddyfile to use your domain:

```bash
nano infra/Caddyfile
```

Replace `kideo.ai` with your actual domain on lines 1-3:

```
yourdomain.com {
    reverse_proxy web:3000
}

www.yourdomain.com {
    redir https://yourdomain.com{uri}
}
```

Save and exit (Ctrl+X, Y, Enter).

### 5.2 Run Database Migrations

```bash
chmod +x infra/deploy.sh
./infra/deploy.sh --build --migrate
```

**What this does:**
1. Pulls latest code from GitHub
2. Builds Docker images (takes 5-10 minutes first time)
3. Runs Prisma database migrations
4. Starts the application with Caddy reverse proxy

You'll see output like:
```
==> Deploying Kideo...
==> Pulling latest changes...
==> Building Docker images...
==> Running database migrations...
==> Restarting services...
==> Deployment complete!
```

### 5.3 Check Application Status

```bash
# Check if containers are running
docker compose ps

# Check logs
docker compose logs -f web

# Check Caddy logs
docker compose logs -f caddy
```

You should see:
- `web` container: healthy
- `caddy` container: running

Press `Ctrl+C` to exit logs.

### 5.4 Verify the Application

Open your browser and go to:
- `https://yourdomain.com` (or https://kideo.ai)

You should see your Kideo application!

**First load might take 20-30 seconds** while Caddy provisions SSL certificates.

---

## Part 6: Post-Deployment

### 6.1 Update Clerk Webhook URL

1. Go back to Clerk dashboard
2. Navigate to "Webhooks"
3. Update your webhook endpoint URL to:
   ```
   https://yourdomain.com/api/webhooks/clerk
   ```
4. Save

### 6.2 Update Clerk URLs

1. In Clerk dashboard, go to "Paths"
2. Set these URLs:
   - Sign in: `/sign-in`
   - Sign up: `/sign-up`
   - After sign in: `/dashboard`
   - After sign up: `/onboarding`
3. In "Home URL", set: `https://yourdomain.com`

### 6.3 Set Up Monitoring (Optional but Recommended)

Install Uptime Robot or similar:
1. Go to https://uptimerobot.com (free tier)
2. Add monitor for `https://yourdomain.com/api/health`
3. Get alerts if your app goes down

---

## Part 7: Future Deployments

### 7.1 For Code Updates

On your local machine:
```bash
# Make changes to code
git add .
git commit -m "Your changes"
git push origin main
```

On the server:
```bash
cd kideoAI
./infra/deploy.sh
```

### 7.2 For Database Schema Changes

On the server:
```bash
cd kideoAI
./infra/deploy.sh --build --migrate
```

### 7.3 View Logs

```bash
cd kideoAI
docker compose logs -f web
```

---

## Troubleshooting

### Issue: Can't SSH to server
```bash
# Check if server is running in Hetzner console
# Try with verbose output:
ssh -v root@<server-ip>
```

### Issue: Domain not loading
```bash
# Check DNS propagation
dig yourdomain.com

# Check if Caddy is running
docker compose ps caddy
docker compose logs caddy
```

### Issue: App showing errors
```bash
# Check environment variables
docker compose exec web printenv

# Check database connection
docker compose logs web | grep -i "database\|prisma\|error"

# Restart services
docker compose restart
```

### Issue: SSL certificate errors
```bash
# Check Caddy logs
docker compose logs caddy

# Ensure ports 80 and 443 are open
sudo ufw status

# Restart Caddy
docker compose restart caddy
```

### Issue: Database migrations failing
```bash
# Check DATABASE_URL is correct
cat .env | grep DATABASE_URL

# Try running migrations manually
docker build --target migrator -t kideo-migrator -f apps/web/Dockerfile .
docker run --rm --env-file .env kideo-migrator sh -c "cd packages/db && npx prisma migrate deploy"
```

---

## Costs Breakdown

- **Hetzner CX22 Server**: €4.15/month (~$4.50)
- **Neon PostgreSQL**: $0 (free tier, 0.5GB storage)
- **Clerk Auth**: $0 (free tier, up to 10k users)
- **Domain**: ~$12/year (if using Namecheap/GoDaddy)

**Total**: ~$4.50/month + domain

---

## Security Checklist

- [x] SSH key authentication enabled
- [x] Firewall configured (UFW)
- [x] Fail2ban installed
- [x] SSL/TLS with automatic renewal (Caddy)
- [ ] Regular backups configured
- [ ] Database backups (Neon handles this)
- [ ] Server updates: `apt update && apt upgrade` monthly

---

## Backup Strategy

### Database
Neon automatically backs up your database. To create manual backup:
1. Go to Neon dashboard
2. Click on your database
3. Click "Restore" to see backup points

### Application Code
Everything is in GitHub - no backup needed.

### Environment Variables
Keep a secure copy of your `.env` file locally:
```bash
# On server
cat .env

# Copy output to password manager or encrypted note
```

---

## Need Help?

**Common commands:**
```bash
# SSH to server
ssh root@<server-ip>

# Go to app directory
cd kideoAI

# Check status
docker compose ps

# View logs
docker compose logs -f

# Restart everything
docker compose restart

# Stop everything
docker compose down

# Start everything
docker compose up -d
```

**Server management:**
```bash
# Check disk space
df -h

# Check memory
free -h

# Check running processes
htop

# Update system packages
apt update && apt upgrade -y
```
