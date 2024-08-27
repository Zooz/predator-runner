# NODE container which runs this service
FROM node:14-alpine

RUN mkdir -p /usr/app
WORKDIR /usr
# Install app dependencies
COPY package.json /usr/
COPY package-lock.json /usr/

RUN apk update && \
    # Install git
    apk add --no-cache bash git openssh && \
#    # Install node-gyp dependencies
    apk add --no-cache make gcc g++ python3 && \
#    # npm install
     npm ci --production

## Bundle app source
COPY /app /usr/app

EXPOSE 8080

CMD [ "node","--max_old_space_size=192","./app/app.js" ]
