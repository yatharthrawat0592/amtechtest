# Docker file CCS Frontend
FROM node:20-buster as ws

# ENV
ENV APP_DIR=/usr/src/ws

# Working directory 
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

COPY package*.json ./

### Install Dependencies
RUN npm install

# copy local file to app folder
COPY . .

EXPOSE 4888

CMD ["npm", "run", "start:ws"]
