FROM nginx
COPY default.conf /etc/nginx/conf.d/default.conf


# Use Ubuntu 22.04 as the base image
FROM ubuntu:22.04

# Update package lists and install certbot
RUN apt-get update && \
    apt-get install -y certbot \
    apt-get install -y python-certbot-nginx \
    nginx -t && nginx -s reload \
    sudo certbot --nginx -d portal.amtech.technology

