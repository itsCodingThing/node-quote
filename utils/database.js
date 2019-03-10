const firebase = require("firebase-admin");
const uuid = require("uuid/v1");

//needed admin credential for firebase project
const serviceAccount = require("../node-quote-database-firebase.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://node-quote-database.firebaseio.com"
});

const db = firebase.database();
const quoteServer = db.ref("server-database/quotes");

async function saveQuotes(quote) {
  await quoteServer.child(`${quote.title}-${uuid()}`).set({ ...quote });
}

module.exports = {
  saveQuotes
};
