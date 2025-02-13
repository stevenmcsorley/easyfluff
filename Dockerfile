# Stage 2: Run the production app
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy built files and public assets from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# Copy package files for production installs
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Install production dependencies and required packages for wait-for-it
RUN apk add --no-cache bash netcat-openbsd && npm ci --only=production

# Copy the wait-for-it.sh script (ensure it's in your repository under "scripts/wait-for-it.sh")
COPY scripts/wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Expose the production port (adjust if needed)
EXPOSE 3000

# Start the production server using wait-for-it to ensure Postgres is up
CMD ["/usr/local/bin/wait-for-it.sh", "db:5432", "--", "npm", "run", "start"]
