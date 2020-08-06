import { initializeApp, credential as _credential, database, firestore, ServiceAccount } from "firebase-admin";
import { QuoteObj } from "./quotes";

const config: ServiceAccount = {
  projectId: "node-quote-database",
  clientEmail: `${process.env.FIREBASE_CLIENT_EMAIL}`,
  privateKey: `${process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")}`,
};

initializeApp({
  credential: _credential.cert(config),
  databaseURL: "https://node-quote-database.firebaseio.com",
});

// realtime databasee
const db = database();
const quoteServer = db.ref("server-database/quotes");

// cloud store
const store = firestore();
const quotesCollection = store.collection("quotes");

async function getQuoteFromDb() {
  let snapshot = await quoteServer.once("value");
  let dataKeys = Object.keys(snapshot.val());
  let url = `server-database/quotes/${dataKeys[Math.floor(Math.random() * dataKeys.length + 1)]}`;
  let quote = await db.ref(url).once("value");
  return quote.val();
}

function saveQuotes({ title, content }: QuoteObj) {
  // check for existing author
  quotesCollection
    .where("content", "==", content)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return quotesCollection.add({ title, content });
      }
    })
    .catch(() => {
      console.log("something wrong is here!!");
    });
}

export default {
  saveQuotes,
  getQuoteFromDb,
};
