FROM node:22.15-slim

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY ../../pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ../../package.json ./package.json
COPY ../../pnpm-lock.yaml ./pnpm-lock.yaml

COPY ../../packages/scoring ./packages/scoring

COPY ../packages ./packages

RUN pnpm install --filter scoring...

WORKDIR /app/packages/scoring

CMD ["pnpm", "start"]