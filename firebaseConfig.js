const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json'); // يجب أن يتطابق الاسم

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
