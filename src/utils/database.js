const firebase = require("firebase-admin");

//  needed admin credential for firebase project
//  const serviceAccount = require("../node-quote-database-firebase.json");
const config = {
  type: "service_account",
  project_id: "node-quote-database",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6rktm%40node-quote-database.iam.gserviceaccount.com",
  client_email: "firebase-adminsdk-6rktm@node-quote-database.iam.gserviceaccount.com",
  private_key_id: `${process.env.FIREBASE_PRIVATE_KEY_ID}`,
  private_key: `${process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")}`,
  client_id: `${process.env.FIREBASE_CLIENT_ID}`,
};

firebase.initializeApp({
  credential: firebase.credential.cert(config),
  databaseURL: "https://node-quote-database.firebaseio.com",
});

const db = firebase.database();
const quoteServer = db.ref("server-database/quotes");

const store = firebase.firestore();
const quotesCollection = store.collection("quotes");

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
