const admin = require('firebase-admin');

// initialize firebase admin
if (admin.apps.length === 0) {
  // load environment variables
  require('dotenv').config();
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

// db reference
const db = admin.firestore();

module.exports = async (req, res) => {
  // get code from query params (via Vercel rewrite)
  const { code } = req.query;

  // look up code in database
  const links = await db.collection('links').where('code', '==', code).get();

  // check if we found one
  if (!links.empty) {
    // get link
    let link = links.docs[0].data().link;

    // if link doesnt have protocol, add one (secure by default)
    if (!link.startsWith('http')) link = 'https://' + link;

    // 301 to link of matching code
    res.redirect(301, link);
  } else {
    // just 301 to homepage
    res.redirect(301, '/');
  }
};
