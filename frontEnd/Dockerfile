FROM node:20.16.0-bullseye AS build

WORKDIR /usr/src/app

COPY package-lock.json .
COPY package.json .

RUN --mount=type=cache,target=/user/src/app/.npm \
    npm set cache /user/src/app/.npm && \
    npm ci

COPY . .


RUN npm run build

FROM nginxinc/nginx-unprivileged:1.23-alpine-perl

COPY nginx.config /etc/nginx/config.d/default.config

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 8080