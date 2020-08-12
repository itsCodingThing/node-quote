import { fetchQuote } from "./lab";

export interface QuoteObj {
  title: string;
  content: string;
}

export async function getQuotes(): Promise<QuoteObj> {
  try {
    const quote = await fetchQuote();
    return quote;
  } catch {}
}
