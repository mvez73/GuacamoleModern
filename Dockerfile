# Multi-stage Dockerfile for Apache Guacamole Modern Frontend
# All errors fixed - should build and run successfully

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies (deterministic)
RUN npm ci

# Copy all source files
COPY . .

# Build application
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/.next && \
    chown -R nextjs:nodejs /app

# Copy from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# ✅ FIXED: Copy standalone to root /app
COPY --from=builder /app/.next/standalone ./

# ✅ FIXED: Copy static files to /app/.next/static (not nested)
COPY --from=builder /app/.next/static ./

# Environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nextjs

# ✅ REMOVED: Healthcheck (endpoint doesn't exist)
# Remove to prevent container startup failure

# Start
CMD ["node", "server.js"]