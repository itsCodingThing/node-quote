import { initializeApp, credential, firestore, ServiceAccount } from "firebase-admin";

import { QuoteObj, SavedQuoteObj } from "./interfaces";

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

const env = process.env.NODE_ENV || "production";

const quotesCollection = env === "production" ? store.collection("quotes") : store.collection("qoutes-dev");

export async function findRandom(n = 1): Promise<Array<QuoteObj>> {
  const result = await quotesCollection.limit(n).get();
  const quotes: Array<QuoteObj> = [];

  result.forEach((snapshot) => {
    const quote: QuoteObj = { id: snapshot.id, title: snapshot.data().title, content: snapshot.data().content };
    quotes.push(quote);
  });

  return quotes;
}

export async function isAlreadySaved(quote: QuoteObj): Promise<SavedQuoteObj> {
  const { content } = quote;

  try {
    const snapshot = await quotesCollection.where("content", "==", content).get();

    if (snapshot.empty) {
      return { exists: false, msg: "does'nt exists!" };
    } else {
      const returnData: Array<SavedQuoteObj> = [];
      snapshot.forEach((docSnapshot) => {
        returnData.push({
          exists: true,
          data: { id: docSnapshot.id, title: docSnapshot.data().title, content: docSnapshot.data().content },
        });
      });
      return { exists: returnData[0].exists, data: returnData[0].data };
    }
  } catch {
    throw new Error("something wrong with the firebase api");
  }
}

export async function save({ title, content }: QuoteObj): Promise<QuoteObj> {
  try {
    const response = await isAlreadySaved({ title, content });

    if (!response.exists) {
      const quote = await quotesCollection.add({ title, content });
      const snapshot = await quote.get();
      const data = snapshot.data();

      return { id: snapshot.id, title: data.title, content: data.content };
    } else {
      return response.data;
    }
  } catch (e) {
    throw e;
  }
}
