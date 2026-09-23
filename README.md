# Lions Club of Nugegoda

Public website and admin panel for weekly projects and newsletters.

## Run it

From this folder:

```bash
npm run install:all
npm run dev
```

Open http://localhost:5173

The first start creates a local PostgreSQL database on port 5433. It does not use the PostgreSQL 17 service already installed on this computer.

## Admin

- Address: http://localhost:5173/admin
- Email: `admin@lionsnugegoda.org`
- Password: `LionsNugegoda#2026`

Change the password under Admin → Settings after the first sign-in.

Sample projects and newsletters are there so the layout is visible. Remove them from the dashboard before sharing the site, then publish the real weekly report.

## Weekly updates

Sign in, open Projects or Newsletters, and publish the new entry. The dashboard reminds you when nothing real has been published in the last seven days.

## Your own database later

Set `EMBEDDED_POSTGRES=false` in `server/.env` and point `DATABASE_URL` at your PostgreSQL server. Then run `npm run dev` again.
