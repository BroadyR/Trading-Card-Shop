# Unified frontend and backend dockerfile
# Use Node.js base image for both backend and frontend
FROM node:14

# Set working directory for the app
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the React frontend
RUN npm run build

# Expose the backend port
EXPOSE 8000

# Start the backend server
CMD [ "node", "app.js" ]
