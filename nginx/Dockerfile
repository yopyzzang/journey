FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

RUN apk add --no-cache tzdata
ENV TZ=Asia/Seoul

RUN echo 'server_tokens off;' > /etc/nginx/conf.d/security.conf

RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]