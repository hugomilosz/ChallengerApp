FROM node:latest

# Copy the React App to the container
COPY package.json ./

# Prepare the container for building React
RUN npm install
RUN npm install react-scripts@5.0.1

COPY . .

# Start the server
EXPOSE 80
