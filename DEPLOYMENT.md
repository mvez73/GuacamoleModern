# Apache Guacamole Modern Frontend - Deployment Guide

This guide will walk you through deploying the Apache Guacamole Modern Frontend to production and uploading it to Docker Hub.

## Prerequisites

- Docker installed on your system
- Docker Hub account ([Sign up](https://hub.docker.com/signup))
- Git for cloning the repository
- Basic understanding of Docker and containers

## Step 1: Prepare Your Docker Hub Repository

### 1.1 Create Docker Hub Repository

1. Log in to [Docker Hub](https://hub.docker.com/)
2. Click "Create Repository"
3. Choose a name, e.g., `guacamole-modern-frontend`
4. Set visibility (Public or Private)
5. Click "Create"

### 1.2 Note Your Repository Details

- **Repository name**: `your-username/guacamole-modern-frontend`
- Keep this handy for the next steps

## Step 2: Build the Docker Image

### 2.1 Clone the Repository

```bash
git clone https://github.com/your-org/guacamole-modern-frontend.git
cd guacamole-modern-frontend
```

### 2.2 Build the Docker Image

```bash
# Build the image
docker build -t your-username/guacamole-modern-frontend:latest .

# Build with specific version tag
docker build -t your-username/guacamole-modern-frontend:1.0.0 .
```

### 2.3 Test the Image Locally

```bash
# Run the container
docker run -d \
  -p 3000:3000 \
  -e GUACAMOLE_URL=http://localhost:8080 \
  --name guacamole-test \
  your-username/guacamole-modern-frontend:latest

# Check logs
docker logs -f guacamole-test

# Test the application
curl http://localhost:3000

# Stop and remove test container
docker stop guacamole-test
docker rm guacamole-test
```

## Step 3: Push to Docker Hub

### 3.1 Log in to Docker Hub

```bash
docker login
```

Enter your Docker Hub username and password when prompted.

### 3.2 Tag the Image (if not already tagged)

```bash
# Tag as latest
docker tag guacamole-modern-frontend:latest your-username/guacamole-modern-frontend:latest

# Tag with version
docker tag guacamole-modern-frontend:latest your-username/guacamole-modern-frontend:1.0.0
```

### 3.3 Push to Docker Hub

```bash
# Push latest tag
docker push your-username/guacamole-modern-frontend:latest

# Push version tag
docker push your-username/guacamole-modern-frontend:1.0.0

# Push all tags
docker push your-username/guacamole-modern-frontend --all-tags
```

### 3.4 Verify on Docker Hub

1. Go to your Docker Hub repository
2. Check that the image is visible
3. Verify tags are present
4. Check image size and details

## Step 4: Deploy Using Docker Compose

### 4.1 Deploy Full Stack (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-org/guacamole-modern-frontend.git
cd guacamole-modern-frontend

# Create environment file
cp .env.example .env
# Edit .env with your settings

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4.2 Access the Application

- **Modern Frontend**: http://localhost:3000
- **Guacamole Server**: http://localhost:8080
- **Default Credentials**: Check Guacamole documentation

## Step 5: Production Deployment

### 5.1 Using Production Docker Compose

```bash
# Set production environment variables
export MYSQL_ROOT_PASSWORD=your_strong_password
export MYSQL_PASSWORD=your_strong_password

# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d

# Check health status
docker-compose -f docker-compose.prod.yml ps
```

### 5.2 Configure Reverse Proxy (Nginx)

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server guacamole-frontend:3000;
    }

    upstream guacamole {
        server guacamole-server:8080;
    }

    server {
        listen 80;
        server_name your-domain.com;

        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Modern Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Guacamole WebSocket
        location /guacamole/websocket {
            proxy_pass http://guacamole/guacamole/websocket;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_read_timeout 86400;
        }

        # Guacamole API
        location /guacamole/ {
            proxy_pass http://guacamole/;
            proxy_set_header Host $host;
        }
    }
}
```

### 5.3 SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy to project
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem

# Set permissions
sudo chmod 644 ./ssl/cert.pem
sudo chmod 600 ./ssl/key.pem
```

## Step 6: Kubernetes Deployment (Optional)

### 6.1 Create Namespace

```bash
kubectl create namespace guacamole
```

### 6.2 Deploy Frontend

Create `frontend-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: guacamole-frontend
  namespace: guacamole
spec:
  replicas: 3
  selector:
    matchLabels:
      app: guacamole-frontend
  template:
    metadata:
      labels:
        app: guacamole-frontend
    spec:
      containers:
      - name: frontend
        image: your-username/guacamole-modern-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: GUACAMOLE_URL
          value: "http://guacamole-service:8080"
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: guacamole-frontend-service
  namespace: guacamole
spec:
  selector:
    app: guacamole-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

### 6.3 Deploy to Kubernetes

```bash
# Apply configuration
kubectl apply -f frontend-deployment.yaml

# Check status
kubectl get pods -n guacamole
kubectl get services -n guacamole

# View logs
kubectl logs -f deployment/guacamole-frontend -n guacamole
```

## Step 7: Monitoring and Maintenance

### 7.1 Check Container Health

```bash
# Check all containers
docker-compose ps

# View specific container logs
docker-compose logs -f guacamole-frontend

# Check resource usage
docker stats
```

### 7.2 Update the Image

```bash
# Pull new image
docker pull your-username/guacamole-modern-frontend:latest

# Restart services
docker-compose up -d

# Or recreate with new image
docker-compose up -d --force-recreate
```

### 7.3 Backup Data

```bash
# Backup MySQL data
docker exec guacamole-mysql mysqldump -u root -p guacamole_db > backup.sql

# Backup volumes
docker run --rm \
  -v guacamole-mysql-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/mysql-backup.tar.gz /data
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs guacamole-frontend

# Check container status
docker inspect guacamole-frontend
```

### Connection refused to Guacamole server

```bash
# Verify Guacamole server is running
docker ps | grep guacamole-server

# Check network connectivity
docker-compose exec guacamole-frontend ping guacamole-server

# Verify environment variables
docker-compose exec guacamole-frontend env | grep GUACAMOLE
```

### WebSocket connection issues

```bash
# Check WebSocket URL configuration
docker-compose logs guacamole-frontend | grep websocket

# Verify WebSocket endpoint is accessible
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://localhost:8080/guacamole/websocket
```

## Security Best Practices

1. **Use HTTPS** in production
2. **Strong passwords** for MySQL and Guacamole
3. **Limit container privileges** (non-root user)
4. **Regular updates** - Keep images updated
5. **Network isolation** - Use Docker networks
6. **Firewall rules** - Only expose necessary ports
7. **Monitor logs** - Check for suspicious activity
8. **Backup regularly** - Automated backups
9. **Use secrets** - Store sensitive data securely
10. **RBAC** - Implement role-based access control

## CI/CD Pipeline (Optional)

### GitHub Actions Example

Create `.github/workflows/docker.yml`:

```yaml
name: Docker Build and Push

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: |
          your-username/guacamole-modern-frontend:latest
          your-username/guacamole-modern-frontend:${{ github.ref_name }}
        cache-from: type=registry,ref=your-username/guacamole-modern-frontend:latest
        cache-to: type=inline
```

## Support

- 📖 [Full Documentation](./DOCKER.md)
- 🐛 [Report Issues](https://github.com/your-org/guacamole-modern-frontend/issues)
- 💬 [Community Forum](https://guacamole.apache.org/community/)

---

Happy Deploying! 🚀
