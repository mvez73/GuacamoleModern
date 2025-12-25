#!/bin/bash

# Apache Guacamole Modern Frontend - Docker Testing Script (Docker Compose v2)
# This script helps you build, run, and test the application using Docker Compose v2

set -e

echo "=========================================="
echo "  Guacamole Modern Frontend"
echo "  Docker Testing Script (v2)"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Error: Docker is not installed${NC}"
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

echo -e "${BLUE}✓ Docker is installed${NC}"
echo ""

# Check if Docker Compose is installed (v2)
if ! docker compose version &> /dev/null 2>&1; then
    echo -e "${YELLOW}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose from: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${BLUE}✓ Docker Compose (v2) is installed${NC}"
echo ""

# Step 1: Build Docker image
echo -e "${BLUE}Step 1: Building Docker image...${NC}"
docker build -t guacamole-modern-frontend:latest .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Image built successfully${NC}"
else
    echo -e "${YELLOW}✗ Image build failed${NC}"
    exit 1
fi
echo ""

# Step 2: Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file from example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠ You may want to edit .env for your configuration${NC}"
fi
echo ""

# Step 3: Check for existing containers
echo -e "${BLUE}Step 2: Checking for existing containers...${NC}"
if [ "$(docker ps -aq -f name=guacamole-modern-frontend)" ]; then
    echo -e "${YELLOW}⚠ Found existing container, stopping...${NC}"
    docker stop guacamole-modern-frontend
    docker rm guacamole-modern-frontend
    echo -e "${GREEN}✓ Old container removed${NC}"
fi
echo ""

# Step 4: Run Docker Compose (development environment)
echo -e "${BLUE}Step 3: Starting services with Docker Compose...${NC}"
docker compose up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Services started successfully${NC}"
else
    echo -e "${YELLOW}✗ Failed to start services${NC}"
    echo "Checking logs..."
    docker compose logs
    exit 1
fi
echo ""

# Step 5: Wait for frontend to be ready
echo -e "${BLUE}Step 4: Waiting for frontend to be ready...${NC}"
sleep 5

# Check if frontend container is running
if [ "$(docker ps -q -f name=guacamole-modern-frontend)" ]; then
    echo -e "${GREEN}✓ Frontend container is running${NC}"
else
    echo -e "${YELLOW}✗ Frontend container is not running${NC}"
    echo "Checking frontend logs..."
    docker compose logs guacamole-modern-frontend
    exit 1
fi
echo ""

# Step 6: Show container info
echo -e "${BLUE}Container Information:${NC}"
echo "  Frontend Name: guacamole-modern-frontend"
echo "  Frontend Port: 3000"
echo "  Frontend URL: http://localhost:3000"
echo ""
echo "  To view all services: docker compose ps"
echo "  To view logs: docker compose logs -f"
echo ""

# Step 7: Show logs hint
echo -e "${BLUE}Useful Commands:${NC}"
echo "  View all logs:     docker compose logs -f"
echo "  View frontend logs: docker compose logs guacamole-modern-frontend -f"
echo "  Stop services:      docker compose down"
echo "  Restart services:    docker compose restart"
echo "  Rebuild & start:   docker compose up -d --build"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Application is ready!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Open your browser and navigate to:${NC}"
echo -e "${GREEN}http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}Test Steps:${NC}"
echo "  1. Open http://localhost:3000"
echo "  2. Click to Sun/Moon icon in the header (top-right)"
echo "  3. Verify that theme switches between light and dark"
echo "  4. Refresh the page to verify theme persistence"
echo "  5. Check browser DevTools - <html> element should have class='dark' or class='light'"
echo ""

# Optional: Open browser automatically (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${BLUE}Opening browser on macOS...${NC}"
    open http://localhost:3000
fi
