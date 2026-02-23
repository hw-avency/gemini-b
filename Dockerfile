FROM node:20-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && npm prune --omit=dev && npm cache clean --force

EXPOSE 8080
CMD ["node", "cloud-run-server.mjs"]
