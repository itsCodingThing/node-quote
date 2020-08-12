import { initializeApp, credential, firestore, ServiceAccount } from "firebase-admin";

import { QuoteObj } from "./utils";

const config: ServiceAccount = {
  projectId: "node-quote-database",
  clientEmail: `${process.env.FIREBASE_CLIENT_EMAIL}`,
  privateKey: `${process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")}`,
};

initializeApp({
  credential: credential.cert(config),
  databaseURL: "https://node-quote-database.firebaseio.com",
});

// cloud store
const store = firestore();
const quotesCollection = store.collection("quotes");

export function saveQuotes({ title, content }: QuoteObj): void {
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
