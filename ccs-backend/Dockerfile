# Docker file CCS Frontend
FROM node:20-buster as builder

# ENV
ENV APP_DIR=/usr/src/app

# Working directory 
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

COPY package*.json ./

### Install Dependencies
RUN npm install

# copy local file to app folder
COPY . .

EXPOSE 8800

CMD ["npm", "start"]
