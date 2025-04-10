# Stage 1: Build dependencies (including SQLite)
FROM node:18-alpine AS builder
WORKDIR /app

# Install build tools for native dependencies
RUN apk add --no-cache python3 make g++ sqlite-dev

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy all source files
COPY . .

# Stage 2: Production image
FROM node:18-alpine
WORKDIR /app

# Install runtime dependencies for SQLite
RUN apk add --no-cache sqlite

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Ensure the database directory exists
RUN mkdir -p ./data

# Environment variables (use docker-compose for sensitive ones)
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=./data/database.sqlite

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD node healthcheck.js || exit 1

# Run as non-root user for security
RUN chown -R node:node /app
USER node

# Start command
CMD ["npm", "start"]