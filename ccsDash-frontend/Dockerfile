# Docker file CCS Frontend
FROM node:20-buster as builder

# ENV
ENV APP_DIR=/app

# Working directory 
WORKDIR $APP_DIR

COPY package*.json ./

### Install Dependencies
RUN npm install

# copy local file to app folder
COPY . .

EXPOSE 3001

CMD ["npm", "start"]
