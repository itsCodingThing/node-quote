import axios from "axios";
export interface QuoteObj {
  title: string;
  content: string;
}

export async function fetchQuote(): Promise<QuoteObj> {
  const response = await axios.get("https://api.quotable.io/random");

  const {
    data: { author: title, content },
  } = response;

  return { title, content };
}
