FROM node

WORKDIR /web

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN cd .. && mv web/dist/ dist && rm -r web && mv dist/ web
RUN gzip -rkv9 .
