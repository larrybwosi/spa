# Spa and Wellness Monorepo Application

This repository contains a full-stack Spa and Wellness booking system. It is structured as a pnpm monorepo consisting of:

- **`apps/api`**: A NestJS-based backend API using Prisma with PostgreSQL.
- **`apps/web`**: A Next.js-based frontend web application styling with Tailwind CSS.
- **`packages/ui`**: Shared React components library.
- **`packages/typescript-config` & `eslint-config`**: Shared configuration packages.

---

## 🚀 Quick Start with Docker Compose

The easiest way to build, configure, and launch the entire ecosystem (including the PostgreSQL database, API backend, and Next.js frontend) is using **Docker Compose**.

### Prerequisites

- [Docker](https://www.docker.com/get-started) (version 20.10.0 or higher)
- [Docker Compose](https://docs.docker.com/compose/) (version v2.0.0 or higher)

### Running the System

1. From the repository root directory, build and launch the services:
   ```bash
   docker compose up --build
   ```
2. Once the startup sequence completes:
   - **PostgreSQL Database** will start, initialize, and health-check.
   - **NestJS API** will start up, automatically run schema migrations/synchronization using Prisma (`prisma db push`), seed initial services and products, and bind to `http://localhost:3001`.
   - **Next.js Web Frontend** will compile and start running at `http://localhost:3000`.

3. Open `http://localhost:3000` in your web browser to access the Spa and Wellness portal!

### Docker Compose Service Details

Our `docker-compose.yml` configures three interconnected containers:

| Service   | Technology        | Port   | Purpose / Notes                                                                                      |
| :-------- | :---------------- | :----- | :--------------------------------------------------------------------------------------------------- |
| **`db`**  | PostgreSQL 17     | `5432` | Stores all user, booking, service, and order data. PERSISTENT through a Docker volume `pgdata`.      |
| **`api`** | NestJS + Prisma 7 | `3001` | Handles backend business logic and database seed. Waits until `db` is fully healthy before starting. |
| **`web`** | Next.js 16        | `3000` | Beautiful frontend client application built on Tailwind CSS.                                         |

---

## 🛠️ Configuration and Environment Variables

The default configuration in `docker-compose.yml` works immediately out of the box. However, you can customize environment variables as needed:

### NestJS API (`api`)

- `DATABASE_URL`: Connection string to PostgreSQL. Default: `postgresql://postgres:postgres@db:5432/spa_wellness`
- `PORT`: Port on which NestJS listens. Default: `3001`
- `NODE_ENV`: Production/development environment. Default: `production`

### Next.js Web (`web`)

- `PORT`: Port on which the Next.js server runs. Default: `3000`
- `NEXT_PUBLIC_API_URL`: URL to the NestJS API. Default: `http://localhost:3001/api`

---

## 📁 Repository Structure and Development

To work with this monorepo locally without Docker:

1. Install dependencies at the workspace root:

   ```bash
   pnpm install
   ```

2. Generate the Prisma client:

   ```bash
   pnpm --filter api exec prisma generate
   ```

3. Start all services in development mode:
   ```bash
   pnpm dev
   ```

---

## 🐳 Stopping and Resetting the Environment

To stop the running Docker containers:

```bash
docker compose down
```

To stop containers and completely remove the persistent database volume (for a fresh start and fresh seed data):

```bash
docker compose down -v
```
