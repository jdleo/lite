# lite.fyi

Lite.fyi is a very micro link shortener, with all the clutter taken away. It does what it says it does (shortens links, duh).

This service is ready to be deployed out of the box with [Vercel](https://vercel.com), and is designed to work with [Neon](https://neon.tech) (Serverless Postgres) for the database.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjdleo%2Flite)

## dev

1. clone

```
git clone git@github.com:jdleo/lite.git
```

2. install dependencies

```
pnpm install
```

3. set up neon database

This project uses Neon (Serverless Postgres). You need to link a database.

**Via Vercel (Recommended):**
- Import the project to Vercel.
- Go to the "Storage" tab in your Vercel project dashboard.
- Select "Neon" and connect/create a new database. This will auto-populate your `DATABASE_URL`.

**Manual:**
- Create a project on [Neon](https://neon.tech).
- Run this SQL command to create the required table:
  ```sql
  CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
- Add your connection string to `.env.local`:
  ```
  DATABASE_URL=postgres://user:password@endpoint.neon.tech/neondb
  ```

4. start dev server

```
pnpm run dev
```

*Note: To run the full stack locally (with API rewrites working perfect), use `vercel dev` if you have the Vercel CLI installed.*

## prod

1. Push to GitHub.
2. Import project into Vercel.
3. Ensure the Neon integration is connected or `DATABASE_URL` is set in Environment Variables.
4. That's it. Vercel handles the rest.

```
pnpm run build
```

## Security & Performance

Lite.fyi takes care of the following:

- **SSRF Protection**: Rejects private and internal IP addresses (e.g., `127.0.0.1`, `169.254.169.254`) to prevent internal network probing.
- **Edge Caching**: Redirects and statistics are cached at Vercel's Edge Network, significantly reducing database hits and latency.
- **DDoS Mitigation**: Implements negative caching for 404s and blocks circular redirect loops.
- **Secure RNG**: Uses cryptographically secure alphanumeric strings for short codes.
- **Validation**: Enforces strict protocol (HTTP/HTTPS only) and URL format checks.
