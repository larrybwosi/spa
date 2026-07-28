<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

NestJS API application for Spa and Wellness booking system.

---

## 🐳 Containerization and Deployment with Docker

The API app has been fully containerized using a highly optimized, multi-stage Docker build to ensure small production image sizes and efficient caching of `pnpm` monorepo workspaces.

### Local Docker Build

If you want to build and run the API container independently of Docker Compose:

1. **Build the image** from the **repository root directory**:

   ```bash
   docker build -f apps/api/Dockerfile -t spa-wellness-api .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     -p 3001:3001 \
     -e DATABASE_URL="postgresql://username:password@host:port/database" \
     --name spa-api-container \
     spa-wellness-api
   ```

### How the Dockerfile Works

- **Base Stage**: Installs `node:22-alpine` and enables `corepack` for `pnpm` workspace compatibility.
- **Builder Stage**: Copies workspace files, caches pnpm directories, installs devDependencies, generates the Prisma client schema, and compiles NestJS code into production-ready JavaScript (`dist/`).
- **Runner Stage**: Minimal alpine image containing only the built bundle, `node_modules` (pruned of devDependencies), and the schema. Starts the container by automatically pushing schema changes with Prisma `db push` and launching NestJS.

### Environment Variables

The container accepts and respects the following environment variables:

- `DATABASE_URL`: The PostgreSQL connection URI.
- `PORT`: Server port (default is `3001`).
- `NODE_ENV`: Runs in `production` mode inside the image.

---

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
