# Apache Guacamole Modern Frontend

A modern, sleek frontend interface for Apache Guacamole with a beautiful UI/UX built with Next.js 15, TypeScript, and shadcn/ui components.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- **Modern UI/UX**: Clean, professional interface with smooth animations
- **Dashboard Overview**: Quick stats and favorite connections
- **Connection Management**: Create, edit, delete, and organize connections
- **Folder Organization**: Group connections for easy management
- **Real-time Sessions**: Live remote desktop sessions via WebSocket
- **Multi-Protocol Support**: RDP, VNC, SSH, Telnet
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode**: Built-in dark/light theme support
- **Status Indicators**: Visual feedback for connection states
- **Search & Filter**: Quickly find connections
- **Favorites System**: Mark frequently used connections

## Technology Stack

- **Frontend**: Next.js 15 (React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **State Management**: React Hooks + Zustand
- **Server**: Node.js 20 (Bun runtime)

## Quick Start with Docker

### Using Docker Compose (Recommended)

The easiest way to get started is with Docker Compose, which includes the frontend, Guacamole server, and MySQL database:

```bash
# Clone the repository
git clone https://github.com/your-org/guacamole-modern-frontend.git
cd guacamole-modern-frontend

# Start all services
docker-compose up -d

# Access the application
open http://localhost:3000
```

This will start:
- **Modern Frontend**: http://localhost:3000
- **Guacamole Server**: http://localhost:8080
- **MySQL Database**: localhost:3306

### Using Docker

```bash
# Build the image
docker build -t guacamole-modern-frontend:latest .

# Run the container
docker run -d \
  -p 3000:3000 \
  -e GUACAMOLE_URL=http://your-guacamole-server:8080 \
  --name guacamole-frontend \
  guacamole-modern-frontend:latest
```

## Development

### Prerequisites

- Node.js 20+ or Bun runtime
- npm, yarn, or bun package manager

### Local Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build the application
bun run build

# Start production server
bun run start
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Guacamole Server URL
GUACAMOLE_URL=http://localhost:8080

# WebSocket URL for Guacamole client
NEXT_PUBLIC_GUACAMOLE_WS_URL=ws://localhost:8080/guacamole/websocket

# Application
NODE_ENV=production
PORT=3000
```

### Connecting to Guacamole Server

The modern frontend requires a running Apache Guacamole server. You can either:

1. **Use Docker Compose**: Includes Guacamole server and MySQL
2. **Use Existing Guacamole**: Point to your existing instance via `GUACAMOLE_URL`

### Authentication

The frontend uses Guacamole's REST API for authentication:

```typescript
POST /api/auth/login
{
  "username": "your-username",
  "password": "your-password"
}
```

## Architecture

```
┌─────────────────┐
│   Browser       │
│  (Next.js UI)   │
└────────┬────────┘
         │ HTTP/HTTPS
         │
┌────────▼────────┐
│   Next.js API   │
│  (REST Endpoints)│
└────────┬────────┘
         │
         │
┌────────▼────────┐
│ Guacamole API   │
│  (Auth, Conn)   │
└────────┬────────┘
         │
┌────────▼────────┐
│  Guacamole Web  │
│   Application   │
└────────┬────────┘
         │ WebSocket
┌────────▼────────┐
│     guacd       │
│   (Proxy)       │
└────────┬────────┘
         │
┌────────▼────────┐
│  Remote Desktop │
│  (RDP/VNC/SSH)  │
└─────────────────┘
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Authenticate with Guacamole

### Connections

- `GET /api/connections` - List all connections
- `POST /api/connections` - Create new connection
- `PUT /api/connections/:id` - Update connection
- `DELETE /api/connections/:id` - Delete connection

### Sessions

- `POST /api/sessions` - Create new session
- `DELETE /api/sessions/:id` - Terminate session
- `GET /api/sessions/active` - List active sessions

## Docker Hub Deployment

### Pushing to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag the image
docker tag guacamole-modern-frontend:latest your-username/guacamole-modern-frontend:latest

# Push to Docker Hub
docker push your-username/guacamole-modern-frontend:latest
```

### Pulling from Docker Hub

```bash
# Pull the image
docker pull your-username/guacamole-modern-frontend:latest

# Run the container
docker run -d \
  -p 3000:3000 \
  -e GUACAMOLE_URL=http://your-guacamole-server:8080 \
  your-username/guacamole-modern-frontend:latest
```

## Production Deployment

### Using Docker Compose (Production)

```bash
# Use production configuration
docker-compose -f docker-compose.prod.yml up -d
```

### Using Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: guacamole-frontend
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
```

## Security Considerations

- Use HTTPS in production
- Configure firewall rules
- Enable authentication
- Use strong passwords
- Regular security updates
- Monitor access logs

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Apache Guacamole](https://guacamole.apache.org/) for the amazing remote desktop gateway
- [Next.js](https://nextjs.org/) for the React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## Support

- 📖 [Documentation](https://guacamole.apache.org/doc/gug/)
- 💬 [Community Forum](https://guacamole.apache.org/community/)
- 🐛 [Issue Tracker](https://github.com/your-org/guacamole-modern-frontend/issues)

## Roadmap

- [ ] Multi-language support
- [ ] Session recording playback
- [ ] File transfer manager
- [ ] User management UI
- [ ] Connection groups
- [ ] Advanced connection parameters
- [ ] Custom themes
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)

---

Made with ❤️ by the Guacamole Modern Frontend Team
