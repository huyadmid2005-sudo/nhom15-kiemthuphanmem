# syntax=docker/dockerfile:1

FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_APP_ENV
ARG VITE_API_BASE_URL_DEV
ARG VITE_API_BASE_URL_PROD
ARG VITE_FORCE_ENV
ARG VITE_ZEGO_APP_ID
ARG VITE_ZEGO_SERVER_SECRET

ENV VITE_APP_ENV=$VITE_APP_ENV \
    VITE_API_BASE_URL_DEV=$VITE_API_BASE_URL_DEV \
    VITE_API_BASE_URL_PROD=$VITE_API_BASE_URL_PROD \
    VITE_FORCE_ENV=$VITE_FORCE_ENV \
    VITE_ZEGO_APP_ID=$VITE_ZEGO_APP_ID \
    VITE_ZEGO_SERVER_SECRET=$VITE_ZEGO_SERVER_SECRET

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
