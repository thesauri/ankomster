FROM node:24-slim

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY src/ ./src/
COPY views/ ./views/

RUN npm run build

RUN npm prune --omit=dev

EXPOSE 8080

CMD [ "npm", "run", "start" ]
