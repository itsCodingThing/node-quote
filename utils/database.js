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

const store = firebase.firestore();
const quotesCollection = store.collection("quotes");

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
  let url = `server-database/quotes/${
    dataKeys[Math.floor(Math.random() * dataKeys.length + 1)]
  }`;
  let quote = await db.ref(url).once("value");
  return quote.val();
}

/**
 * @param {title: "some title",content: "some quote"} quote
 */

function saveQuotes(quote) {
  let { title, content } = quote;

  // check for exists author
  quotesCollection
    .where("content", "==", content)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return quotesCollection.add({ title, content });
      }
    });
}

module.exports = {
  saveQuotes,
  getQuoteFromDb,
};
