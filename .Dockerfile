# Stage 1: Build the frontend app
FROM node:14 AS frontend

# Set working directory
WORKDIR /app/frontend

# Copy package.json and yarn.lock (or package-lock.json) to the working directory
COPY certgini/package.json  ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend app files
COPY certgini .

# Build the frontend app
RUN npm build

# # Stage 2: Build the backend app
# FROM node:14 AS backend

# Set working directory
WORKDIR /app/backend

# Copy package.json and yarn.lock (or package-lock.json) to the working directory
COPY backend/package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend app files
COPY backend .

# # Stage 3: Combine frontend and backend
# FROM node:14

# Set working directory
WORKDIR /app

# # Copy built frontend files from the 'frontend' stage
# COPY --from=frontend /app/frontend/build ./frontend/build

# # Copy built backend files from the 'backend' stage
# COPY --from=backend /app/backend .

# Expose backend port
EXPOSE 3001

# Start the backend server
CMD ["node", "server.js"]
