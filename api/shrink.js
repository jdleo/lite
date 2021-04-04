const admin = require('firebase-admin');

// load environment variables
require('dotenv').config();

// initialize firebase admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

// get db reference
const db = admin.firestore();

/**
 * helper method to generate random string
 * @param {Number} n
 */
function randomString(n) {
  // character set
  let chars = 'abcdefghijklmnopqrstuvwxyz';
  chars += chars.toUpperCase();
  chars += '1234567890';

  return Array(n)
    .fill(0)
    .map(() => chars[~~(Math.random() * chars.length)])
    .join('');
}

exports.handler = (req, ctx, res) => {
  // parse json body
  const { link } = JSON.parse(req.body);

  // generate shortcode
  const code = randomString(5);

  // post original link and code to database
  db.collection('links').doc().set({ link, code });

  // create full shortlink
  const shortLink = `${req.headers.host}/${code}`;

  // create data
  const data = {
    success: true,
    shortLink,
  };

  res(null, { statusCode: 200, body: JSON.stringify(data) });
};
