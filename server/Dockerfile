FROM node:12.13.1-alpine3.10

RUN mkdir -p /app/server
WORKDIR /app/server

RUN npm -g config set user root
RUN npm -g install tuql

COPY . /app/server
