FROM node:20-slim

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY ../../pnpm-workspace.yaml ./
COPY ../../package.json ./
COPY ../../pnpm-lock.yaml ./

COPY ../../packages/client ./packages/client
COPY ../../packages ./packages

RUN pnpm install --filter client...

WORKDIR /app/packages/client

RUN pnpm build-only

EXPOSE 5173

# Start dev server
CMD ["pnpm", "dev"]