# EventTN — Event Management Platform Backend

A clean, production-ready REST API backend for an event management platform built with **Node.js, Express, PostgreSQL, and Prisma ORM**.

## Features

- JWT authentication (register / login / me)
- Role-based authorization: `ADMIN`, `ORGANIZER`, `SPONSOR`
- Organizers manage their own events (CRUD)
- Public event browsing
- Sponsors browse events and send sponsorship requests
- Organizers accept/reject sponsorship requests
- Admin dashboard: view & delete users/events, view all sponsorships
- Image upload for event banners (Cloudinary, with automatic local-storage fallback)
- Centralized error handling & input validation
- Standardized JSON response format

## Tech Stack

| Layer          | Technology            |
|----------------|------------------------|
| Runtime        | Node.js + Express.js  |
| Database       | PostgreSQL             |
| ORM            | Prisma                 |
| Auth           | JWT + bcrypt           |
| Uploads        | Multer (+ Cloudinary)  |
| Validation     | express-validator      |
| Security       | Helmet, CORS           |
| Logging        | Morgan                 |

## Project Structure

```
src/
 ├── config/          # DB, Cloudinary, Multer configuration
 ├── controllers/      # Route handlers (thin, delegate to services)
 ├── middleware/        # auth, role, validation, error middleware
 ├── models/            # Prisma client re-export (schema lives in prisma/)
 ├── prisma/            # schema.prisma, migrations, seed.js
 ├── routes/            # Express routers
 ├── services/          # Business logic / DB queries
 ├── utils/             # Helpers: AppError, catchAsync, jwt, response
 ├── validators/         # express-validator rule sets
 ├── uploads/           # Local fallback storage for images
 ├── app.js             # Express app setup
 └── server.js          # Entry point
```

## Installation

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 13+ running locally or remotely

### 2. Clone & install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/eventtn?schema=public"
JWT_SECRET="replace_this_with_a_long_random_secret"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development

# Optional - leave blank to use local disk storage instead
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=

CLIENT_URL="http://localhost:3000"
```

### 4. Set up the database
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# Seed the admin account
npm run seed
```

> All `prisma:*` and `seed` scripts are wired through `dotenv-cli` (`dotenv -e .env -- ...`) so they load your root `.env` file correctly. Prisma CLI itself only auto-loads a `.env` located next to `schema.prisma`, not one in the project root — the `dotenv -e .env --` prefix works around that so you can keep a single `.env` at the project root.

Default admin credentials created by the seed script:
```
email:    admin@eventtn.com
password: admin123
```

### 5. Run the server
```bash
# development (auto-restart)
npm run dev

# production
npm start
```

The API will be available at `http://localhost:5000`.

## API Overview

All responses follow this shape:

**Success**
```json
{ "success": true, "message": "...", "data": {} }
```

**Error**
```json
{ "success": false, "message": "...", "errors": [] }
```

### Auth
| Method | Endpoint            | Access | Description               |
|--------|----------------------|--------|----------------------------|
| POST   | `/api/auth/register` | Public | Register (ORGANIZER/SPONSOR) |
| POST   | `/api/auth/login`    | Public | Login, returns JWT + user |
| GET    | `/api/auth/me`       | Private | Get current user         |

### Events
| Method | Endpoint                          | Access              | Description               |
|--------|-------------------------------------|----------------------|----------------------------|
| GET    | `/api/events`                       | Public               | List all events (filters: category, city, featured, search) |
| GET    | `/api/events/:id`                   | Public               | Get single event          |
| GET    | `/api/events/organizer/my-events`   | Organizer            | List own events            |
| POST   | `/api/events`                       | Organizer            | Create event (multipart/form-data, field `banner`) |
| PUT    | `/api/events/:id`                   | Owner Organizer/Admin | Update event               |
| DELETE | `/api/events/:id`                   | Owner Organizer/Admin | Delete event               |

### Sponsors
| Method | Endpoint                | Access  | Description            |
|--------|---------------------------|---------|--------------------------|
| GET    | `/api/sponsors/events`    | Sponsor | Browse all events        |

### Sponsorships
| Method | Endpoint                       | Access               | Description                    |
|--------|-----------------------------------|------------------------|----------------------------------|
| POST   | `/api/sponsorships`               | Sponsor                | Create sponsorship request       |
| GET    | `/api/sponsorships/my`            | Sponsor                | View own requests                |
| GET    | `/api/organizer/sponsorships`     | Organizer               | View requests for own events     |
| PATCH  | `/api/sponsorships/:id`           | Owner Organizer/Admin   | Accept/reject (`status` body)    |

### Admin
| Method | Endpoint                    | Access | Description         |
|--------|-------------------------------|--------|-----------------------|
| GET    | `/api/admin/users`            | Admin  | List all users        |
| GET    | `/api/admin/events`           | Admin  | List all events       |
| GET    | `/api/admin/sponsorships`     | Admin  | List all sponsorships |
| DELETE | `/api/admin/users/:id`        | Admin  | Delete a user          |
| DELETE | `/api/admin/events/:id`       | Admin  | Delete an event        |

## Authentication

Include the JWT in the `Authorization` header for protected routes:
```
Authorization: Bearer <token>
```

## Image Uploads

Event creation/update accepts a `banner` field as `multipart/form-data`.
- If `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, and `CLOUDINARY_SECRET` are set in `.env`, images upload to Cloudinary and the `banner` field stores the Cloudinary URL.
- Otherwise, images are stored locally in `src/uploads/` and served from `/uploads/<filename>`.

## Postman Collection

Import `EventTN.postman_collection.json` (included in this repo) into Postman. It contains every endpoint pre-configured with a `{{baseUrl}}` variable (defaults to `http://localhost:5000`) and a `{{token}}` variable that is automatically set after login/register requests.

## Scripts

| Command                  | Description                        |
|---------------------------|-------------------------------------|
| `npm run dev`             | Start with nodemon (auto-reload)   |
| `npm start`                | Start in production mode           |
| `npm run prisma:generate` | Generate Prisma client             |
| `npm run prisma:migrate`  | Run dev migrations                 |
| `npm run prisma:deploy`   | Apply migrations (production)      |
| `npm run prisma:studio`   | Open Prisma Studio (DB GUI)        |
| `npm run seed`             | Seed the admin user                |

## Notes on Design Decisions

- Kept intentionally simple: no microservices, no WebSockets, no payment/notification systems, per project scope.
- Business logic lives in `services/`, controllers stay thin and only handle req/res.
- All errors flow through a single `errorMiddleware`, including Prisma error codes (unique constraint, not found, etc.).
- `catchAsync` wrapper avoids repetitive try/catch blocks in controllers.
