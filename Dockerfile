FROM node:12.18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install -g db-migrate
RUN npm install -g db-migrate-mysql

COPY . .

CMD [ "npm", "start" ]