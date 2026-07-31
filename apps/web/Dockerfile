# Stage 1: Base image
FROM node:20-alpine AS base
RUN npm install -g pnpm@10.34.1
WORKDIR /app

# Stage 2: Dependencies & Builder
FROM base AS builder
# Copy configuration and manifest files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/web/package.json ./apps/web/
# Copy workspace packages that are referenced
COPY packages/eslint-config/ ./packages/eslint-config/
COPY packages/typescript-config/ ./packages/typescript-config/
COPY packages/ui/ ./packages/ui/

# Install dependencies (frozen-lockfile)
RUN pnpm install --frozen-lockfile

# Copy the web application source code
COPY apps/web/ ./apps/web/

# Build the Web Next.js application
# Next.js build typically expects API and other environmental configurations or dummy variables if needed.
# Since we need Next.js build:
RUN pnpm --filter web run build

# Stage 3: Runner
FROM base AS runner
ENV NODE_ENV=production

# Copy built artifacts from builder. In Next.js, running start requires package files and Next.js built dirs.
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml generate-env.js .env.example ./
COPY apps/web/package.json ./apps/web/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/ ./packages/ui/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy build artifacts and other public/assets
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/next.config.js ./apps/web/next.config.js
COPY --from=builder /app/apps/web/postcss.config.mjs ./apps/web/postcss.config.mjs

# Also copy packages/ui compiled/output files if they are referenced at runtime
COPY --from=builder /app/packages/ui/src ./packages/ui/src

WORKDIR /app/apps/web
EXPOSE 3000

CMD ["sh", "-c", "node /app/generate-env.js && pnpm run start"]
