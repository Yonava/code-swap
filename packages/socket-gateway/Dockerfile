FROM node:22.15-slim

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY ../../pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ../../package.json ./package.json
COPY ../../pnpm-lock.yaml ./pnpm-lock.yaml

COPY ../../packages/socket-gateway ./packages/socket-gateway

COPY ../packages ./packages

RUN pnpm install --filter socket-gateway...

WORKDIR /app/packages/socket-gateway

CMD ["pnpm", "start"]