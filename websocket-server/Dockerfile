# Dockerfile for the WebSocket Server
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --production
RUN apk add --no-cache curl # This line is essential for the health check to pass

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
