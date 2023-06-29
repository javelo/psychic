from node:18-buster-slim as build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

RUN yarn build

FROM nginx:1.23.3

COPY --from=build /app/build /usr/share/nginx/html

COPY default.conf.template /etc/nginx/conf.d/default.conf.template
COPY nginx.conf /etc/nginx/nginx.conf

CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'