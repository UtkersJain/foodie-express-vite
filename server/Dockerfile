FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --production
RUN apk add --no-cache curl # Added this line

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
