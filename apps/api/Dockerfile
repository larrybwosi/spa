# Multi-stage Dockerfile for NestJS API in a pnpm monorepo
FROM node:22-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app

# Enable pnpm store caching
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Set a dummy DATABASE_URL during build phase to satisfy Prisma v7 configuration checks
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Copy root configuration files for pnpm workspace
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# Install all dependencies including devDependencies (needed to build)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Generate Prisma Client
RUN pnpm --filter api exec prisma generate --schema=apps/api/prisma/schema.prisma

# Build the API application
RUN pnpm --filter api build

# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

# Copy production assets and dependencies
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api ./apps/api

EXPOSE 3001

# Change to the api application directory for execution
WORKDIR /app/apps/api

# Run database schema push/creation and start NestJS server
CMD ["sh", "-c", "npx prisma db push --schema=prisma/schema.prisma && node dist/main"]
