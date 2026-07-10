# GCAP Calculator Analytics

Phase 1 of the GCAP calculator usage analytics platform: a Next.js API that ingests events from the Android app and stores them in SQLite (local dev) or PostgreSQL (production).

## Stack

- Next.js 16 (App Router)
- Prisma ORM
- SQLite for local development
- Zod for request validation

## Setup

```bash
cd calculator-analytics
npm install
cp .env.example .env
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for API docs and curl examples.

## Environment

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Prisma connection string. Default: `file:./dev.db` |
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

## Production notes

- Switch `DATABASE_URL` to PostgreSQL (Neon, Supabase, Vercel Postgres).
- Set a strong `ANALYTICS_API_KEY` in Vercel env vars.
- Phase 4 will add the visual dashboard; Phase 2 wires the Android app.

## Project location

```
E:\Work\Task\GCAP\7.2\calculator-analytics
```

Sibling to the GCAP Android repo at `GCAP_Android`.
