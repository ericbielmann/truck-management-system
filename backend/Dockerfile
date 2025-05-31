FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5001

# Create demo user when container starts
CMD ["sh", "-c", "node scripts/create-demo-user.js && npm run dev"]