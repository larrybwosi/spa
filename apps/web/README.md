# Next.js Spa and Wellness Web Portal

This is the user-facing web portal for the Spa and Wellness system, built using [Next.js](https://nextjs.org) and Tailwind CSS.

---

## 🐳 Containerization and Deployment with Docker

The web application is containerized with a multi-stage Docker build optimized for monorepos, compiling Next.js in production mode and serving it with minimal footprint.

### Independent Docker Build

If you want to build and run the web container independently of Docker Compose:

1. **Build the image** from the **repository root directory**:

   ```bash
   docker build -f apps/web/Dockerfile -t spa-wellness-web .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e NEXT_PUBLIC_API_URL="http://localhost:3001/api" \
     --name spa-web-container \
     spa-wellness-web
   ```

### How the Dockerfile Works

- **Base Stage**: Installs `node:22-alpine` and enables `corepack` for `pnpm` workspace compatibility.
- **Builder Stage**: Copies root configurations and the shared `packages/` workspace directories (such as `@repo/ui`), runs the dependency install step, and compiles Next.js with the build pipeline (`pnpm build`).
- **Runner Stage**: Prepares a slim production environment. Copies only necessary Next.js static, public, and dependency files and starts the application server.

### Environment Variables

- `NEXT_PUBLIC_API_URL`: The URL where the frontend can connect to the NestJS backend API. Defaults to `http://localhost:3001/api`.
- `PORT`: Serves the application on the specified port inside the container (default `3000`).

---

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
