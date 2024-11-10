FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY src/ ./src/
COPY views/ ./views/

RUN npm run build

RUN npm prune --production

EXPOSE 8080

CMD [ "npm", "run", "start" ]
