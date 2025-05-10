FROM node:18-alpine
WORKDIR /app

# Install dependencies
RUN apk add --no-cache python3 make g++ sqlite-dev

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Create data directory and set permissions
RUN mkdir -p /app/data && \
    chown -R node:node /app

# Environment variables
ENV PORT=3000
ENV DB_PATH=/app/data/database.sqlite
ENV SECRET_KEY=123456

# Expose port
EXPOSE 3000

# Switch to non-root user
USER node

# Start command
CMD ["npm", "start"]