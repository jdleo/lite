import { createHash } from 'crypto';
import { neon } from '@neondatabase/serverless';

const SALT = 'lite-fyi-2026-experimental-salt';

async function getOptimalCodeLength(sql) {
  const result = await sql`SELECT COUNT(*) as count FROM links`;
  const n = parseInt(result[0].count);
  const charsetSize = 62;

  // Requirement: P(collision) < 0.0001
  // Formula: M approx 5000 * n^2
  // We handle n=0/1 case
  if (n < 2) return 1;

  const requiredM = 5000 * Math.pow(n, 2);
  const length = Math.ceil(Math.log(requiredM) / Math.log(charsetSize));

  return Math.max(1, length);
}

function generateCode(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default async function handler(req, res) {
  const { link, proof, ts } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  // Bot prevention: Time window check (2 seconds)
  const now = Date.now();
  if (!ts || Math.abs(now - ts) > 2000) {
    return res.status(403).json({ success: false, error: 'Unauthorized: Proof expired. Please try again.' });
  }

  // Bot prevention: Signature check
  const expectedProof = createHash('sha256').update(String(ts) + SALT).digest('hex');
  if (proof !== expectedProof) {
    return res.status(403).json({ success: false, error: 'Unauthorized: Invalid request signature.' });
  }

  const sql = neon(process.env.DATABASE_URL);
  const length = await getOptimalCodeLength(sql);
  const code = generateCode(length);

  try {
    await sql`INSERT INTO links (url, code) VALUES (${link}, ${code})`;
    const shortLink = `${req.headers.host}/${code}`;
    res.status(200).json({ success: true, shortLink });
  } catch (err) {
    // Unique constraint violation (collision)
    if (err.code === '23505') {
      const moreSecureCode = generateCode(length + 1);
      await sql`INSERT INTO links (url, code) VALUES (${link}, ${moreSecureCode})`;
      res.status(200).json({ success: true, shortLink: `${req.headers.host}/${moreSecureCode}` });
    } else {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
}
