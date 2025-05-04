FROM node:22.15-slim

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY ../../pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ../../package.json ./package.json
COPY ../../pnpm-lock.yaml ./pnpm-lock.yaml

COPY ../../packages/match-making ./packages/match-making

COPY ../packages ./packages

RUN pnpm install --filter match-making...

WORKDIR /app/packages/match-making

CMD ["pnpm", "start"]