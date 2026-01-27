---
name: Docker Builder
version: 1.0.0
author: Community Contributor
category: development
tags:
  - docker
  - containers
  - devops
  - infrastructure
compatibility:
  - gemini
  - claude
---

# Docker Builder

Create and optimize Docker configurations with best practices. Build production-ready Dockerfiles, multi-stage builds, Docker Compose setups, and efficient containerization strategies.

## Triggers

Use this skill when the user wants to:
- Create a Dockerfile
- Set up Docker Compose
- Containerize an application
- Optimize Docker images
- Configure development environments with Docker
- Deploy containers to production

Keywords: "docker", "dockerfile", "docker compose", "container", "containerize", "multi-stage build", "docker optimization"

## Features

- **Dockerfile Best Practices**: Security, layer caching, minimal image sizes
- **Multi-Stage Builds**: Separate build and runtime environments
- **Docker Compose**: Multi-container application orchestration
- **Volume Management**: Data persistence and bind mounts
- **Network Configuration**: Container networking and service communication
- **Production Optimization**: Security hardening and performance tuning

## Dockerfile Best Practices

### Basic Structure

```dockerfile
# Use specific version tags, not 'latest'
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js

# Start application
CMD ["node", "server.js"]
```

### Layer Optimization

```dockerfile
# Bad: Creates multiple layers unnecessarily
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y vim
RUN apt-get clean

# Good: Combine into single layer
RUN apt-get update && \
    apt-get install -y \
      curl \
      vim && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

## Multi-Stage Builds

### Node.js Application

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Run as non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Go Application

```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Production stage - minimal image
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy only the binary
COPY --from=builder /app/main .

# Run as non-root
RUN adduser -D -u 1001 appuser
USER appuser

EXPOSE 8080
CMD ["./main"]
```

### Python Application

```dockerfile
# Build stage
FROM python:3.12-slim AS builder

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.12-slim

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /root/.local /root/.local

# Copy application
COPY . .

# Make sure scripts are executable
ENV PATH=/root/.local/bin:$PATH

# Run as non-root
RUN useradd -m -u 1001 appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
CMD ["python", "app.py"]
```

## Docker Compose

### Basic Web Application

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    networks:
      - app-network

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - app-network

volumes:
  postgres-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

### Development Environment

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      target: development
    volumes:
      # Bind mount for hot reload
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
      - "9229:9229"  # Debug port
    environment:
      - NODE_ENV=development
    command: npm run dev
    networks:
      - dev-network

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=myapp_dev
      - POSTGRES_USER=dev
      - POSTGRES_PASSWORD=devpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres-dev:/var/lib/postgresql/data
    networks:
      - dev-network

volumes:
  postgres-dev:

networks:
  dev-network:
```

## Volume Management

### Named Volumes

```yaml
# docker-compose.yml
services:
  app:
    volumes:
      # Named volume for persistence
      - app-data:/app/data

volumes:
  app-data:
    driver: local
```

### Bind Mounts

```yaml
services:
  app:
    volumes:
      # Bind mount (development)
      - ./src:/app/src:ro  # read-only
      - ./config:/app/config
```

### tmpfs Mounts

```yaml
services:
  app:
    tmpfs:
      # In-memory temporary storage
      - /tmp
      - /app/cache
```

## Networking

### Custom Networks

```yaml
services:
  frontend:
    networks:
      - frontend-net
      - backend-net

  backend:
    networks:
      - backend-net
      - database-net

  db:
    networks:
      - database-net

networks:
  frontend-net:
  backend-net:
  database-net:
    internal: true  # Not accessible from host
```

### Service Discovery

```yaml
# Services can communicate using service names
services:
  api:
    environment:
      - DATABASE_HOST=postgres  # Service name
      - REDIS_HOST=redis

  postgres:
    # Accessible at 'postgres' hostname

  redis:
    # Accessible at 'redis' hostname
```

## Production Optimization

### Security Best Practices

```dockerfile
# Use minimal base images
FROM alpine:latest

# Run as non-root user
RUN adduser -D -u 1001 appuser
USER appuser

# Don't include secrets in image
# Use environment variables or secrets management

# Scan for vulnerabilities
# Run: docker scan myimage:tag
```

### Image Size Optimization

```dockerfile
# Use alpine variants
FROM node:20-alpine  # Much smaller than node:20

# Use multi-stage builds
FROM builder AS final

# Clean up in same layer
RUN apt-get update && \
    apt-get install -y package && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Use .dockerignore
# Add: node_modules, .git, *.md, tests/
```

### .dockerignore Example

```
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
dist
build
coverage
.vscode
.idea
*.log
.DS_Store
```

### Build Arguments and Environment Variables

```dockerfile
# Build arguments (build-time)
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine

ARG BUILD_DATE
LABEL build_date=${BUILD_DATE}

# Environment variables (runtime)
ENV NODE_ENV=production
ENV PORT=3000

# Can be overridden at runtime:
# docker run -e PORT=8080 myimage
```

## Common Commands

```bash
# Build image
docker build -t myapp:1.0 .

# Build with specific target
docker build --target production -t myapp:prod .

# Run container
docker run -d -p 3000:3000 --name myapp myapp:1.0

# Run with environment variables
docker run -e NODE_ENV=production -e PORT=8080 myapp:1.0

# Docker Compose
docker compose up -d
docker compose down
docker compose logs -f
docker compose ps

# Clean up
docker system prune -a
docker volume prune

# View logs
docker logs -f container_name

# Execute command in running container
docker exec -it container_name sh

# View image layers
docker history myapp:1.0

# Inspect image
docker inspect myapp:1.0
```

## Health Checks

### Dockerfile Health Check

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

### Docker Compose Health Check

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
```

## Best Practices Summary

1. **Use specific image tags**: Never use `latest` in production
2. **Minimize layers**: Combine RUN commands when possible
3. **Leverage build cache**: Copy dependency files before application code
4. **Run as non-root**: Create and use non-privileged user
5. **Use multi-stage builds**: Separate build and runtime dependencies
6. **Scan for vulnerabilities**: Use `docker scan` or similar tools
7. **Use .dockerignore**: Exclude unnecessary files
8. **Health checks**: Always implement health checks for production
9. **Named volumes**: Use for persistent data
10. **Resource limits**: Set memory and CPU limits in production
