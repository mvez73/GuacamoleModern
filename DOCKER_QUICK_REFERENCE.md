# 🐳 Docker Quick Reference (Docker Compose v2)

## Build & Run

### Quick Start (Recommended)
```bash
# Start with Docker Compose v2 (full stack)
docker compose up -d

# Or use automated script
./test-docker.sh
```

### Manual Build & Run
```bash
# Build image
docker build -t guacamole-modern-frontend:latest .

# Run container
docker run -d \
  --name guacamole-modern-frontend \
  -p 3000:3000 \
  --restart unless-stopped \
  guacamole-modern-frontend:latest
```

## Docker Compose v2 Commands

### Service Management
```bash
# View status of all services
docker compose ps

# View logs for all services
docker compose logs -f

# View logs for specific service
docker compose logs -f guacamole-modern-frontend

# Stop all services
docker compose down

# Stop and remove with volumes
docker compose down -v

# Stop and remove orphan containers
docker compose down --remove-orphans

# Restart all services
docker compose restart

# Rebuild and start
docker compose up -d --build

# Scale a service
docker compose up -d --scale guacamole-modern-frontend=2
```

### Container Management
```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container logs
docker logs -f guacamole-modern-frontend

# Stop container
docker stop guacamole-modern-frontend

# Start container
docker start guacamole-modern-frontend

# Restart container
docker restart guacamole-modern-frontend

# Remove container
docker rm guacamole-modern-frontend

# Force remove (even if running)
docker rm -f guacamole-modern-frontend
```

### Image Management
```bash
# List images
docker images

# Remove image
docker rmi guacamole-modern-frontend:latest

# Remove unused images
docker image prune

# Remove all unused data
docker system prune
```

## Ports

| Service | Port | Description |
|----------|-------|-------------|
| Frontend | 3000 | Main application |
| Guacamole | 8080 | Guacamole server |
| guacd | 4822 | Guacamole daemon |
| MySQL | 3306 | Database |
| Redis | 6379 | Caching (optional) |

## Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
# Edit .env with your settings
nano .env
```

Key variables:
- `GUACAMOLE_URL` - Guacamole server address
- `NEXT_PUBLIC_GUACAMOLE_WS_URL` - WebSocket URL
- `NODE_ENV` - production or development
- `PORT` - Application port (default: 3000)

## Testing Dark/Light Mode

Once container is running:

1. **Open**: http://localhost:3000
2. **Toggle**: Click Sun/Moon icon in header
3. **Verify**: Theme switches immediately
4. **Persist**: Refresh page - theme should stay
5. **Check DevTools**: `<html>` element should have `class="dark"` or `class="light"`

## Troubleshooting

### Issue: Container won't start

```bash
# Check logs for errors
docker compose logs guacamole-modern-frontend

# Check if it's actually running
docker ps | grep guacamole-modern-frontend

# Remove and recreate
docker compose down
docker compose up -d
```

### Issue: Theme doesn't switch

**Steps:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check `<html>` element class attribute
4. Check Network tab for failed resource loads
5. Clear localStorage: `localStorage.clear()`
6. Refresh page

### Issue: Theme doesn't persist after refresh

**Check:**
```javascript
// In browser console, run:
console.log(localStorage.getItem('guacamole-theme'))
// Expected: 'light' or 'dark'
// If null: ThemeProvider not working correctly
```

**Fix:**
```bash
# Stop and remove container
docker compose down

# Rebuild image (ensure latest code)
docker compose build

# Run again
docker compose up -d
```

## Health Check

```bash
# Test if app is responding
curl -I http://localhost:3000

# Expected: HTTP/1.1 200 OK
```

## Logs

### View Real-time Logs
```bash
# All services
docker compose logs -f

# Frontend specific
docker compose logs -f guacamole-modern-frontend
```

## Cleanup

### Stop Everything

```bash
# Stop all services
docker compose down

# Stop and remove with volumes
docker compose down -v

# Remove orphan containers
docker compose down --remove-orphans
```

## Quick Test Checklist

- [ ] Container starts without errors
- [ ] Can access http://localhost:3000
- [ ] Theme toggle works (Sun/Moon icon)
- [ ] Dark mode looks good
- [ ] Light mode looks good
- [ ] Theme persists after refresh
- [ ] No console errors
- [ ] Responsive on mobile

---

**For complete testing guide, see [TESTING.md](./TESTING.md)**
