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
# RUN yarn run build
EXPOSE 5173

# Serve the built app with a lightweight web server
CMD ["yarn", "run", "dev","--host"]

# Expose the container port
