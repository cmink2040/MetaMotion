# Base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the React app
COPY . .

# Build the React app
RUN npm run build

# Serve the built app with a lightweight web server
RUN npm install -g serve
CMD serve -s build -l 3000

# Expose the container port
EXPOSE 3000
