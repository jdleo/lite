import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

function generateCode(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let { link } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  if (!link) {
    return res.status(400).json({ success: false, error: 'Link is required' });
  }

  // Auto-prepend https:// if missing protocol (no ://)
  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(link)) {
    link = 'https://' + link;
  }

  // Block self-shortening (loops)
  try {
    const urlCheck = new URL(link);
    if (urlCheck.host === req.headers.host) {
      return res.status(400).json({ success: false, error: 'Circular links are not allowed' });
    }
  } catch (e) {
    // URL validation happens below
  }

  // 1. Validation
  if (link.length > 2000) {
    return res.status(400).json({ success: false, error: 'Link exceeds 2000 characters' });
  }

  try {
    const url = new URL(link);
    // 4. Protocol Check
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return res.status(400).json({ success: false, error: 'Only http and https protocols are supported' });
    }

    // 5. SSRF Protection: Block private/internal IPs
    const privateIPRegex = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|169\.254\.)/;
    if (privateIPRegex.test(url.hostname)) {
      return res.status(400).json({ success: false, error: 'Access to internal or private URLs is restricted' });
    }

    // Enforce dot in hostname (basic TLD check) unless localhost (blocked anyway)
    if (!url.hostname.includes('.') && url.hostname !== 'localhost') {
      return res.status(400).json({ success: false, error: 'Invalid URL format' });
    }
  } catch (e) {
    return res.status(400).json({ success: false, error: 'Invalid URL format' });
  }

  const sql = neon(process.env.DATABASE_URL);

  // 2. Optimistic Code Generation (Fixed Length = 6)
  // 6 chars base64url = ~68 billion combinations
  const length = 6;
  const code = generateCode(length);

  try {
    await sql`INSERT INTO links (url, code) VALUES (${link}, ${code})`;
    const shortLink = `${req.headers.host}/${code}`;
    res.status(200).json({ success: true, shortLink });
  } catch (err) {
    // Unique constraint violation (collision)
    if (err.code === '23505') {
      // Retry once with a slightly longer code to avoid infinite loops
      const retryCode = generateCode(length + 1);
      try {
        await sql`INSERT INTO links (url, code) VALUES (${link}, ${retryCode})`;
        const shortLink = `${req.headers.host}/${retryCode}`;
        res.status(200).json({ success: true, shortLink });
      } catch (retryErr) {
        console.error('Collision retry failed:', retryErr);
        res.status(500).json({ success: false, error: 'Failed to generate short link, please try again.' });
      }
    } else {
      console.error('Database error:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
}
