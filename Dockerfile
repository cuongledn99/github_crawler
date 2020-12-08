FROM node:10.15.1

# Install yarrn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
#RUN apt-get update && apt-get install yarn

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# install package
COPY package.json .
COPY yarn.lock .
RUN cd /usr/src/app && npm install

COPY . .

# RUN yarn run build
RUN yarn run build
RUN rm -r ./src

EXPOSE 5023

CMD [ "npm", "run", "start" ]