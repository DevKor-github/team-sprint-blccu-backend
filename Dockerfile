#Build stage

FROM node:18 as build

COPY ./package.json /myfolder/
COPY ./package-lock.json /myfolder/
WORKDIR /myfolder/
RUN npm install

COPY . /myfolder/

CMD ["npm", "start:dev"]