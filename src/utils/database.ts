import { initializeApp, credential, database, firestore, ServiceAccount } from "firebase-admin";
// import dotenv from "dotenv";
import { QuoteObj } from "./quotes";

// Initialize the enviroment config from .env file for local development
// dotenv.config();

const config: ServiceAccount = {
  projectId: "node-quote-database",
  clientEmail: `${process.env.FIREBASE_CLIENT_EMAIL}`,
  privateKey: `${process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")}`,
};

initializeApp({
  credential: credential.cert(config),
  databaseURL: "https://node-quote-database.firebaseio.com",
});

// realtime databasee
const db = database();
const quoteServer = db.ref("server-database/quotes");

// cloud store
const store = firestore();
const quotesCollection = store.collection("quotes");

async function getQuoteFromDb(): Promise<database.DataSnapshot> {
  const snapshot = await quoteServer.once("value");
  const dataKeys = Object.keys(snapshot.val());
  const url = `server-database/quotes/${dataKeys[Math.floor(Math.random() * dataKeys.length + 1)]}`;
  const quote = await db.ref(url).once("value");
  return quote.val();
}

function saveQuotes({ title, content }: QuoteObj): Promise<firestore.CollectionReference> | void {
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
