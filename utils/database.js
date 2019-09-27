const firebase = require("firebase-admin");
const uuid = require("uuid/v1");
const isEqual = require("lodash/isEqual");

//needed admin credential for firebase project
const serviceAccount = require("../node-quote-database-firebase.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://node-quote-database.firebaseio.com",
});

const db = firebase.database();
const quoteServer = db.ref("server-database/quotes");

function filterQuotes(resQuote, quotes) {
  let i = 0;
  for (let key in quotes) {
    if (isEqual(resQuote, quotes[key])) {
      ++i;
    }
  }
  return i;
}

async function getQuoteFromDb() {
  let snapshot = await quoteServer.once("value");
  let dataKeys = Object.keys(snapshot.val());
  let url = `server-database/quotes/${dataKeys[Math.floor(Math.random() * dataKeys.length + 1)]}`;
  let quote = await db.ref(url).once("value");
  return quote.val();
}

/**
 * @param {title: "some title",content: "some quote"} quote
 */

function saveQuotes(quote) {
  quoteServer.once("value").then((snapshot) => {
    let data = snapshot.val();
    let repeat = filterQuotes(quote, data);
    if (repeat == 0) {
      quoteServer.child(`${quote.title}-${uuid()}`).set({ ...quote });
    }
  });
}

module.exports = {
  saveQuotes,
  getQuoteFromDb,
};
