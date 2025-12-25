import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const { code } = req.query;
  const sql = neon(process.env.DATABASE_URL);

  const response = await sql`SELECT url FROM links WHERE code = ${code}`;

  if (response && response.length > 0) {
    let link = response[0].url;
    if (!link.startsWith('http')) link = 'https://' + link;

    // Enable Vercel Edge Caching (24 hours)
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.redirect(301, link);
  } else {
    // Negative Caching: cache misses for 10 minutes to prevent DB probing
    res.setHeader('Cache-Control', 's-maxage=600');
    res.redirect(301, '/');
  }
}
