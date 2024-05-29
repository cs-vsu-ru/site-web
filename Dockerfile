FROM node

ARG GITHUB_REPO
LABEL org.opencontainers.image.source=https://github.com/${GITHUB_REPO}

WORKDIR /web

COPY package*.json ./
RUN npm install

COPY . .

ENTRYPOINT npm run serve