FROM node:25-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm@10

# -------------------------
# Build
# -------------------------
FROM base AS build
COPY . .
RUN --mount=type=secret,id=GITHUB_TOKEN \
  pnpm config set //npm.pkg.github.com/:_authToken $(cat /run/secrets/GITHUB_TOKEN) && \
  pnpm install
RUN pnpm --filter @app/astro build

RUN pnpm deploy --filter @app/astro --prod /out/front

# 7
# Runtime
# -------------------------
FROM base AS front
WORKDIR /front

# Copy front source
COPY --from=build /app/apps/astro/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["node", "./dist/server/entry.mjs"]
