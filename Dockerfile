#Build stage

FROM node:18 as build

WORKDIR /usr/src/my-app

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "start"]