const admin = require('firebase-admin');
const serviceAccount = require('./firebase_account/serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://proyectointegrador-e93e3-default-rtdb.firebaseio.com"
});

const db = admin.database();

module.exports = db;
