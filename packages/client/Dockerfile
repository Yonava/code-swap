FROM code-swap-base

WORKDIR /app/packages/client

RUN pnpm build

EXPOSE 5173

CMD ["pnpm", "dev"]