import axios from "axios";
import db from "./database";

export interface QuoteObj {
  title: string;
  content: string;
}

async function getQuotes(): Promise<QuoteObj> {
  try {
    let { data } = await axios.get("https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand");

    if (data.length > 1) {
      let randomQuote = Math.floor(Math.random() * data.length);
      return {
        title: data[randomQuote].title.rendered,
        content: data[randomQuote].content.rendered,
      };
    } else {
      return {
        title: data[0].title.rendered,
        content: data[0].content.rendered,
      };
    }
  } catch (error) {
    return db.getQuoteFromDb();
  }
}

export { getQuotes };
