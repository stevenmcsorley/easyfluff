# # Use an official Node.js image
# FROM node:18-alpine


# # Install bash (or just make sure sh is present)
# RUN apk add --no-cache bash

# # Set working directory
# WORKDIR /app

# # Copy package files and install dependencies
# COPY package.json package-lock.json ./
# RUN npm install

# # Copy the rest of your application code
# COPY . .

# # Expose the port your Remix app uses (5173)
# EXPOSE 5173

# # Start Remix in development mode and bind to all network interfaces
# CMD ["npm", "run", "dev", "--", "--host"]

# Stage 1: Build the Remix app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of your application code
COPY . .

# Build the Remix app for production
RUN npm run build

# Stage 2: Run the production app
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy built files and public assets from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# Copy package.json and package-lock.json into runner stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Expose the production port (adjust if needed)
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"]
