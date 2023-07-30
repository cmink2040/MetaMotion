# Base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY yarn*.lock package.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the React app
COPY . .

# Build the React app

RUN yarn run build

# Serve the built app with a lightweight web server

# Step 2: Serve the built Vite.js app with a lightweight server
FROM nginx:alpine

# Copy the built Vite.js app from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the default HTTP port for Nginx
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]


# Expose the container port
