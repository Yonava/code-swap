FROM node:20-slim

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace files
COPY ../../pnpm-workspace.yaml ./
COPY ../../package.json ./
COPY ../../pnpm-lock.yaml ./

# Copy client and shared packages
COPY ../../packages/client ./packages/client
COPY ../../packages ./packages

# Ensure pnpm uses the override from package.json
RUN pnpm install --filter client...

WORKDIR /app/packages/client

# Optional: verify the override was applied
RUN pnpm ls rollup

# Build client
RUN pnpm build-only

EXPOSE 5173

# Start dev server
CMD ["pnpm", "dev"]