# Multi-stage Dockerfile for Apache Guacamole Modern Frontend
# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json bun.lock ./
RUN corepack enable && corepack prepare bun@latest --activate

# Copy all source files
COPY . .

# Build the application
RUN bun run build

# Stage 2: Production image
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy built files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]

# Stage 3: Development image (optional)
FROM node:20-alpine AS development

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN npm ci

# Copy source files
COPY . .

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=development

# Start development server
CMD ["bun", "run", "dev"]
