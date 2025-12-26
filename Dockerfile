# Multi-stage Dockerfile for Apache Guacamole Modern Frontend
# Using Bun (as originally designed) for best compatibility

# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install Bun runtime (Alpine Linux)
RUN apk add --no-cache curl && \
    curl -fsSL https://bun.sh/install | bash

# Set PATH for Bun
ENV PATH="/root/.bun/bin:${PATH}"

# Install dependencies
RUN bun install --frozen-lockfile

# Copy all source files
COPY . .

# Build application
RUN bun run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Install Bun runtime
RUN apk add --no-cache curl && \
    curl -fsSL https://bun.sh/install | bash

# Set PATH for Bun
ENV PATH="/root/.bun/bin:${PATH}"

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/.next && \
    chown -R nextjs:nodejs /app

# Copy from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copy build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# User
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD bun run -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start with dumb-init
ENTRYPOINT ["dumb-init", "--", "bun", "server.js"]