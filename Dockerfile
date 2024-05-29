FROM node

ARG GITHUB_REPO
LABEL org.opencontainers.image.source=https://github.com/${GITHUB_REPO}

WORKDIR /web

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN cd .. && mv web/dist/ dist && rm -r web && mv dist/ web
RUN gzip -rkv9 .

ENTRYPOINT ["npm", "run", "build"]