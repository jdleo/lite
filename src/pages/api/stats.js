import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    const sql = neon(process.env.DATABASE_URL);

    try {
        const result = await sql`SELECT COUNT(*) as count FROM links`;

        // Cache stats for 1 hour to prevent DB exhaustion via COUNT(*)
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        res.status(200).json({ count: parseInt(result[0].count) });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
}
