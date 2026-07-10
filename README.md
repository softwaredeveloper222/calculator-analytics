# GCAP Calculator Analytics

Phase 1 of the GCAP calculator usage analytics platform: a Next.js API that ingests events from the Android app and stores them in Supabase (PostgreSQL).

## Stack

- Next.js 16 (App Router)
- Prisma ORM
- Supabase PostgreSQL
- Zod for request validation

## Setup

### 1. Supabase database

In [Supabase](https://supabase.com) → your project → **Project Settings** → **Database** → **Connection string**:

1. Copy the **Transaction pooler** URI (port `6543`) → `DATABASE_URL`
2. Copy the **Direct connection** URI (port `5432`) → `DIRECT_URL`
3. Replace `[YOUR-PASSWORD]` with your database password

### 2. Local env

```bash
cd calculator-analytics
npm install
cp .env.example .env
# Edit .env with your Supabase connection strings
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the dashboard.

## Environment

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase **transaction pooler** connection string (port 6543). Used at runtime on Vercel. |
| `DIRECT_URL` | Supabase **direct** connection string (port 5432). Used for `prisma db push` from your machine. |
| `ANALYTICS_API_KEY` | Bearer token required by Android ingest requests |

In development, if `ANALYTICS_API_KEY` is unset, auth is skipped. Set it before deploying.

## API

### `POST /api/events`

Ingest one or more analytics events (max 100 per request).

**Headers**

```
Authorization: Bearer <ANALYTICS_API_KEY>
Content-Type: application/json
```

**Body**

```json
{
  "events": [
    {
      "event": "calculator_opened",
      "calculatorId": "psig",
      "sessionId": "uuid",
      "deviceId": "anonymous-install-id",
      "appVersion": "1.0",
      "platform": "android"
    }
  ]
}
```

**Response:** `202 Accepted`

### `GET /api/analytics/overview`

Returns event counts grouped by calculator and event type, plus the 20 most recent events. Same Bearer auth as ingest.

### `GET /api/health`

Database connectivity check (no auth).

## Deploy to Vercel

1. Run `npm run db:push` once against your Supabase database (creates tables).
2. In Vercel → **Settings** → **Environment Variables**, add:
   - `DATABASE_URL` (transaction pooler, port 6543)
   - `DIRECT_URL` (direct connection, port 5432)
   - `ANALYTICS_API_KEY` (strong secret for the Android app)
3. Redeploy the project.
4. Verify: `https://<your-app>.vercel.app/api/health` should return `"database": "connected"`.

## Project location

```
E:\Work\Task\GCAP\7.2\calculator-analytics
```

Sibling to the GCAP Android repo at `GCAP_Android`.
