FROM node:12.14.0-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./

RUN npm i --production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]
