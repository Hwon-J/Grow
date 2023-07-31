FROM nginx

WORKDIR /build

RUN mkdir ./build

ADD ./build ./build

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx.conf /etc/nginx/conf.d

EXPOSE 3001

CMD ["nginx", "-g", "damon off;"]
