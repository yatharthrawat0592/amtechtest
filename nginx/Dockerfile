#This is a sample Image 
FROM ubuntu 
MAINTAINER user@gmail.com 

RUN apt-get update 
RUN apt-get install –y nginx 
CMD [“echo”,”Image created”] 

FROM nginx
COPY default.conf /etc/nginx/conf.d/default.conf
