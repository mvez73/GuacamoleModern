# Multi-stage Dockerfile for Apache Guacamole Modern Frontend
# Works with both npm and bun.lock - lets the package manager decide

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files (will use package.json and bun.lock if it exists)
COPY package.json package-lock.json* ./

# Install dependencies (npm will use bun.lock if present, or generate its own)
RUN npm ci

# Copy all source files
COPY . .

# Build application (npm will use "bun run build" if bun.lock exists)
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/.next && \
    chown -R nextjs:nodejs /app

# Copy from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder /chown=nextjs:nodejs /app/package.json ./package.json

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
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start (simple and reliable)
CMD ["node", "server.js"]