# Stage 1: Build the Remix app
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and Vite config from the local app folder
COPY app/package*.json ./
COPY app/vite.config.ts ./
# (Optional) Copy remix.config.js if you use one:
COPY app/vite.config.ts ./

# Install dependencies
RUN npm install

# Copy the rest of the app source code into /app
COPY app/ ./

# Build the Remix app (runs "remix vite:build" as defined in package.json)
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine AS runner
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy all files from the builder stage
COPY --from=builder /app .

# Expose the port the app listens on (typically 3000)
EXPOSE 3000

# Start the Remix server using the start script defined in package.json
CMD ["npm", "start"]
