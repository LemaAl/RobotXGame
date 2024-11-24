const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json'); // استيراد المفتاح الخاص بـ Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
