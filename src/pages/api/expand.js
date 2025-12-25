import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const { code } = req.query;
  const sql = neon(process.env.DATABASE_URL);

  const response = await sql`SELECT url FROM links WHERE code = ${code}`;

  if (response && response.length > 0) {
    let link = response[0].url;
    if (!link.startsWith('http')) link = 'https://' + link;
    res.redirect(301, link);
  } else {
    res.redirect(301, '/');
  }
}
