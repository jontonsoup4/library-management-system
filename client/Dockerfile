FROM node:12.13.1-alpine3.10

RUN mkdir -p /app/client
WORKDIR /app/client

RUN npm -g config set user root
RUN npm -g install serve

COPY package.json /app/client
COPY yarn.lock /app/client

RUN yarn

COPY . /app/client

RUN yarn build
