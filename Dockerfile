# Use a lightweight Node.js image
FROM node:18-alpine

WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Next.js runs on port 3000 by default
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
