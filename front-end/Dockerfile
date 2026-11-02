FROM node:20-alpine AS construcao
WORKDIR /app

COPY front-end/package.json front-end/package.json
RUN cd front-end && npm install

COPY logica logica
COPY front-end front-end

WORKDIR /app/front-end

ARG VITE_URL_DA_API=http://localhost:3000/api
ENV VITE_URL_DA_API=$VITE_URL_DA_API

RUN npx vite build

FROM nginx:alpine
COPY front-end/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=construcao /app/front-end/dist /usr/share/nginx/html
EXPOSE 80
