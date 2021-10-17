FROM node:14.16.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY externalApi /usr/src/app/externalApi
COPY lib /usr/src/app/lib
COPY middlewares /usr/src/app/middlewares
COPY routes /usr/src/app/routes

COPY app.js /usr/src/app/
COPY config.js /usr/src/app/
COPY index.js /usr/src/app/
COPY package-lock.json /usr/src/app/
COPY package.json /usr/src/app/

# Install package
RUN npm install

EXPOSE 3100
CMD ["npm", "start"]