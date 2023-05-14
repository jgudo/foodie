# Use an official Node.js runtime as a parent image
FROM node:12

# Set the working directory to /app
WORKDIR /

# Copy package.json and package-lock.json to the container
COPY package*.json package-lock*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build
WORKDIR /build
#
# Expose port 3000 to the outside world
EXPOSE 9000

# Start the application
CMD ["node", "server.js"]
