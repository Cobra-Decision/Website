# Backend API

This project uses **Bun**, **NestJS**, and **Prisma**.

---

## Requirements

Make sure you have **Bun** installed.

### Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```


Check installation:

```bash
bun --version
```

---

## Running the Project

1. Move to the backend directory:

```bash
cd ./backend
```

2. Install dependencies:

```bash
bun install
```

3. Run the project in development mode:

```bash
bun run start:dev
```

The API will start on:

```
http://localhost:3333
```

---

## Swagger (API Docs)

Swagger UI is available at:

```
http://localhost:3333/swagger
```

Use it to test and explore all endpoints.

---

## Default Admin Credentials

Use the following credentials to log in as admin:

```
email: admin@admin.com
password: 123
```

⚠️ **Change these credentials in production.**

---

## Database (Prisma Studio)

To open Prisma Studio (database UI):

```bash
npx prisma studio
```

This allows you to view and edit database records in the browser.

---

## Notes

- Ensure `.env` is configured correctly before running the project.
- Prisma is used for database access and migrations.

---

