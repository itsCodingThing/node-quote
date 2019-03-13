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

function filterQuotes(resQuote, quotes) {
  let i = 0;
  for (let key in quotes) {
    if (
      resQuote.title === quotes[key].title &&
      resQuote.content === quotes[key].content
    ) {
      ++i;
    }
  }

  return i;
}

function saveQuotes(quote) {
  quoteServer.once("value").then(snapshot => {
    let data = snapshot.val();
    let repeat = filterQuotes(quote, data);
    if (repeat > 0) {
      console.log("quote is already exist");
    } else {
      quoteServer.child(`${quote.title}-${uuid()}`).set({ ...quote });
    }
  });
}

module.exports = {
  saveQuotes
};
