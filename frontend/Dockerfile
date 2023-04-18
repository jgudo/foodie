# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory to /app
WORKDIR /

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install app dependencies with Yarn
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN yarn build

# Serve the build output with a lightweight http server
RUN yarn global add serve

# Expose port 80 to the outside world
EXPOSE 3000

# Start the http server to serve the build output
CMD ["serve", "-s", "build", "-l", "3000"]