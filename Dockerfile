FROM node

COPY . /app

WORKDIR /app

RUN npm install -g gulp
RUN npm install
RUN gulp babel

CMD ["gulp", "server"]
