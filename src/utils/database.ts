import { initializeApp, credential as _credential, database, firestore, ServiceAccount } from "firebase-admin";
import { QuoteObj } from "./quotes";

// <([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)
//  needed admin credential for firebase project
// const config: ServiceAccount = {
//   type: "service_account",
//   project_id: "node-quote-database",
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url:
//     "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6rktm%40node-quote-database.iam.gserviceaccount.com",
//   client_email: "firebase-adminsdk-6rktm@node-quote-database.iam.gserviceaccount.com",
//   private_key_id: `${process.env.FIREBASE_PRIVATE_KEY_ID}`,
//   private_key: `${process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")}`,
//   client_id: `${process.env.FIREBASE_CLIENT_ID}`,
// };

const config: ServiceAccount = {
  projectId: "node-quote-database",
  clientEmail: "firebase-adminsdk-6rktm@node-quote-database.iam.gserviceaccount.com",
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
