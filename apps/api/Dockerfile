# Stage 1: Base image
FROM node:20-alpine AS base
RUN npm install -g pnpm@10.34.1
WORKDIR /app

# Stage 2: Dependencies & Builder
FROM base AS builder
# Copy configuration and manifest files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/eslint-config/ ./packages/eslint-config/
COPY packages/typescript-config/ ./packages/typescript-config/
COPY packages/ui/ ./packages/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the workspace and build
COPY apps/api/ ./apps/api/

# Generate Prisma Client (needed for build and runtime)
RUN DATABASE_URL="postgresql://dummy" pnpm --filter api exec prisma generate

# Build the NestJS application
RUN pnpm --filter api run build

# Stage 3: Runner
FROM base AS runner
ENV NODE_ENV=production

# Copy configuration and workspaces
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml generate-env.js .env.example ./
COPY apps/api/package.json ./apps/api/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/

# Copy the completely built and generated node_modules from builder to preserve all symlinks and generated files
COPY --from=builder /app/node_modules /app/node_modules

# Copy built NestJS application from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/prisma.config.ts ./apps/api/prisma.config.ts

WORKDIR /app/apps/api
EXPOSE 3001

CMD ["sh", "-c", "node /app/generate-env.js && pnpm run start:prod"]
