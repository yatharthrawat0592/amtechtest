FROM nginx
RUN mkdir -p /etc/nginx/certs
COPY amtech-ccs-crt.crt /etc/nginx/certs/amtech-ccs-crt.crt
COPY amtech-ccs-key.key /etc/nginx/certs/nginx/amtech-ccs-key.key
COPY default.conf /etc/nginx/conf.d/default.conf



