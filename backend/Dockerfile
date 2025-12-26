FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "node utils/seedProducts.js && node server.js"]
