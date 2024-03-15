#Build stage

FROM node:18 as build

COPY ./package.json /myfolder/
COPY ./yarn.lock /myfolder/
WORKDIR /myfolder/
RUN yarn install

COPY . /myfolder/

CMD ["npm", "start:dev"]