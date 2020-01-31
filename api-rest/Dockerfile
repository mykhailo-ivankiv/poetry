FROM node:13.7-alpine
WORKDIR /
COPY . .
RUN yarn install --production
CMD [ "node", "./src/app.mjs" ]
