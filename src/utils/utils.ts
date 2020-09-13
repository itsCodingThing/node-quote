import axios from "axios";

import { QuoteObj, ServerResponse, SureThingPromiseRes } from "./interfaces";

export function sendServerResponse({ ok, response, error }: ServerResponse): ServerResponse {
  return { ok, response, error };
}

export async function fetchQuote(): Promise<QuoteObj> {
  const result = await sureThing(axios.get("https://api.quotable.io/random"));

  if (result.ok) {
    const {
      response: { data },
    } = result;

    return { title: data.author, content: data.content };
  } else {
    throw new Error("quotable api is not working");
  }
}

export function sureThing<T>(p: Promise<T>): Promise<SureThingPromiseRes<T>> {
  return p.then((response) => ({ ok: true, response })).catch((error) => Promise.resolve({ ok: false, error }));
}
