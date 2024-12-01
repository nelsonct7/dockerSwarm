FROM node:alpine

WORKDIR /user/src/app

ENV NODE_ENV=production

COPY package.json .

COPY package-lock.json .

RUN --mount=type=cache,target=/user/src/app/.npm \
    npm set cache /user/src/app/.npm && \
    npm ci --only=production

USER node

COPY --chown=node:node . .

EXPOSE 3002

CMD [ "node","App.js" ]