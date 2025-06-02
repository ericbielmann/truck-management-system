FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Ensure public directory exists with required files
RUN ls -la public/

EXPOSE 3000

CMD ["npm", "start"]