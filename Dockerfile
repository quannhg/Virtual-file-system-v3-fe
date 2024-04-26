ARG NODE_VERSION=18.13.0

################## Stage 1 ##################
FROM node:${NODE_VERSION}-alpine as development
WORKDIR /app

COPY package.json yarn.lock tsconfig.json tsconfig.node.json vite.config.ts index.html *.config.cjs ./
COPY ./src ./src

RUN yarn install && yarn build

################## Stage 2 ##################
FROM node:${NODE_VERSION}-alpine as production
WORKDIR /app

COPY --chown=node:node --from=development /app/dist .
RUN yarn global add serve

EXPOSE 30012
CMD serve -s . -l 30012