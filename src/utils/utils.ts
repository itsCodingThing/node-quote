import axios from "axios";
import { findRandom, save } from "./database";

export interface QuoteObj {
  id?: string;
  title: string;
  content: string;
}

export async function fetchQuote(): Promise<QuoteObj> {
  const result = await sureThing(axios.get("https://api.quotable.io/random"));

  if (result.ok) {
    const {
      response: {
        data: { author: title, content },
      },
    } = result;

    const savedQuote = await save({ title, content });

    return savedQuote;
  } else {
    const qoutes = await findRandom();

    return qoutes[0];
  }
}

interface SureThingPromiseRes<T> {
  ok: boolean;
  response?: T;
  error?: T;
}

export function sureThing<T>(p: Promise<T>): Promise<SureThingPromiseRes<T>> {
  return p.then((response) => ({ ok: true, response })).catch((error) => Promise.resolve({ ok: false, error }));
}
