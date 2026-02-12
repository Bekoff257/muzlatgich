# Muzlatgich Boshqaruv

Production-ready monorepo for cold-storage/warehouse management.

## Stack
- `apps/web`: React + TS + Vite + Tailwind + React Query + RHF + Zod + Firebase Auth (Email/Password + Phone OTP)
- `apps/api`: NestJS + MongoDB + Mongoose + Firebase Admin auth guard + Swagger + Excel export

## Structure
- `apps/web`
- `apps/api`
- `docker-compose.yml`

## Setup
1. Install deps:
   ```bash
   corepack enable
   pnpm install
   ```
2. Start Mongo + API via Docker:
   ```bash
   docker compose up mongo -d
   ```
3. Configure env files:

### `apps/api/.env`
```env
MONGO_URL=mongodb://localhost:27017/muzlatgich
PORT=4000
CORS_ORIGIN=http://localhost:5173
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
ADMIN_EMAIL=admin@example.com
SEED_ROOMS=1-xona,2-xona,3-xona,4-xona
SEED_PRODUCT_TYPES=Shirin,Nordon,Standart
```

### `apps/web/.env`
```env
VITE_API_URL=http://localhost:4000/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

4. Run both apps:
```bash
pnpm dev
```

## API docs
Swagger available at: `http://localhost:4000/api/docs`

## Admin bootstrap
Set `ADMIN_EMAIL`. On first login with matching Firebase email, backend profile role is auto-assigned as `ADMIN`.

## Seed behavior
On API startup, if rooms/product-types are empty they are seeded using `SEED_ROOMS` and `SEED_PRODUCT_TYPES` values.

## Implemented pages
- Auth (Email/Password + Phone OTP)
- Dashboard (3 stat cards)
- Yangi mijoz qo'shish
- Faol mijozlar + modal + hisob-kitob
- Qarzdorlar + Mening qarzlarim
- Arxiv + XLSX export link
