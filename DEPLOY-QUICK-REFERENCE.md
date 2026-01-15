# Kideo Deployment Quick Reference

## Quick Deploy Commands

### Standard Deployment (no rebuild)
```bash
./deploy-prod.sh
```
Use this for code changes that don't affect dependencies or database schema.

### Full Rebuild + Migration
```bash
./deploy-prod.sh --build --migrate
```
Use this when:
- Database schema changed (Prisma migrations)
- Dependencies changed (package.json updates)
- Major changes that need a fresh build

### Build Only (no migration)
```bash
./deploy-prod.sh --build
```
Use when dependencies changed but database schema didn't.

---

## Server Access

### SSH to Production
```bash
ssh kideo-prod
```

### View Logs
```bash
ssh kideo-prod "cd kideoAI && docker compose logs -f web"
```

### Check Status
```bash
ssh kideo-prod "cd kideoAI && docker compose ps"
```

### Restart Services
```bash
ssh kideo-prod "cd kideoAI && docker compose restart"
```

---

## Troubleshooting

### Check if site is up
```bash
curl https://kideo.ai/api/health
```

### View recent logs
```bash
ssh kideo-prod "cd kideoAI && docker compose logs --tail=50 web"
```

### Check database connection
```bash
ssh kideo-prod "cd kideoAI && docker compose logs web | grep -i database"
```

### Full restart (if things are broken)
```bash
ssh kideo-prod "cd kideoAI && docker compose down && docker compose up -d"
```

---

## Production Info

- **Server**: kideo-prod (77.42.94.227)
- **URL**: https://kideo.ai
- **Database**: Neon PostgreSQL
- **Auth**: Clerk
- **Hosting**: Hetzner Cloud (CX22)
- **Reverse Proxy**: Caddy (automatic HTTPS)

---

## Common Workflows

### After making code changes
1. Test locally: `pnpm dev`
2. Commit changes: `git add . && git commit -m "..."`
3. Deploy: `./deploy-prod.sh`

### After changing database schema
1. Update schema: `packages/db/prisma/schema.prisma`
2. Test locally: `pnpm db:push`
3. Commit changes: `git add . && git commit -m "..."`
4. Deploy: `./deploy-prod.sh --build --migrate`

### Checking production status
```bash
# Quick health check
curl https://kideo.ai/api/health

# View logs
ssh kideo-prod "cd kideoAI && docker compose logs -f"
```

---

## Emergency Contacts

If you need help, see DEPLOYMENT.md for full documentation.
