# Kideo Production Server

## Server Details
- **Name**: kideo-prod-01
- **IPv4 Address**: 77.42.94.227
- **IPv6 Address**: 2a01:4f9:c013:3ced::/64
- **Location**: Helsinki, Finland (hel1-dc2)
- **Provider**: Hetzner Cloud
- **Plan**: CPX22 (2 vCPU, 4GB RAM, 80GB SSD)
- **Cost**: €6.99/month (~$7.60/month)
- **Created**: 2026-01-13

## SSH Access
```bash
ssh root@77.42.94.227
```

Your SSH key has been installed: `~/.ssh/id_ed25519`

## Hetzner Console
Project: Kideo PROD
Console: https://console.hetzner.com/projects/13064678/servers/117425710/overview

## Next Steps

### 1. Configure DNS (Do this first!)
Go to your domain registrar for **kideo.ai** and add these DNS records:

```
Type: A
Name: @
Value: 77.42.94.227
TTL: 300

Type: A
Name: www
Value: 77.42.94.227
TTL: 300
```

DNS propagation takes 5-60 minutes. Check with: `dig kideo.ai`

### 2. Connect to Server and Deploy
Once DNS is configured:

```bash
# SSH into server
ssh root@77.42.94.227

# Clone repository
git clone https://github.com/teeks12/kideoAI.git
cd kideoAI

# Run setup script
chmod +x infra/setup-server.sh
./infra/setup-server.sh

# Create .env file with your existing credentials
nano .env
```

Paste your environment variables (you already have these):
```env
DATABASE_URL=postgresql://...your-neon-url...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://kideo.ai
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
NODE_ENV=production
```

### 3. Deploy Application
```bash
# Build and deploy with migrations
chmod +x infra/deploy.sh
./infra/deploy.sh --build --migrate
```

### 4. Verify Deployment
Open your browser and go to: https://kideo.ai

First load may take 20-30 seconds while Caddy provisions SSL certificates.

### 5. Update Clerk Settings
1. Go to Clerk dashboard
2. Update webhook URL to: `https://kideo.ai/api/webhooks/clerk`
3. Update home URL to: `https://kideo.ai`

## Monitoring

Check application status:
```bash
ssh root@77.42.94.227
cd kideoAI
docker compose ps        # Check container status
docker compose logs -f   # View logs
```

Health check endpoint: https://kideo.ai/api/health

## Maintenance

### Update application:
```bash
ssh root@77.42.94.227
cd kideoAI
./infra/deploy.sh
```

### With database migrations:
```bash
./infra/deploy.sh --build --migrate
```

### View logs:
```bash
docker compose logs -f web
```

## Support
- Hetzner Support: https://console.hetzner.cloud/support
- Server Management: https://console.hetzner.com/projects/13064678/servers
