# Use the official Node.js image as the base image
FROM node:18-alpine

# Install build dependencies for sqlite3
RUN apk add --no-cache python3 make g++ sqlite-dev

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies (this will rebuild sqlite3 for the container's platform)
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port the backend will run on
EXPOSE 3000

# Start the backend server
CMD ["npm", "start"]