FROM node:22.15-slim

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY ../../pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ../../package.json ./package.json
COPY ../../pnpm-lock.yaml ./pnpm-lock.yaml

COPY ../../packages/game-management ./packages/game-management

COPY ../packages ./packages

RUN pnpm install --filter game-management...

WORKDIR /app/packages/game-management

CMD ["pnpm", "start"]