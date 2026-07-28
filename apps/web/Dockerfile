# Multi-stage Dockerfile for Next.js Web in a pnpm monorepo
FROM node:22-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app

# Enable pnpm store caching
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Copy root configuration files for pnpm workspace
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web

# Install all dependencies including devDependencies (needed to build)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the Next.js web application
RUN pnpm --filter web build

# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy production assets and dependencies
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/web ./apps/web

EXPOSE 3000

# Change to the web application directory for execution
WORKDIR /app/apps/web

# Start Next.js production server
CMD ["npx", "next", "start", "-p", "3000"]
