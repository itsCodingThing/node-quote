import axios from "axios";
import { QuoteObj } from "./utils";
import { JSDOM } from "jsdom";

export async function fetchQuote(): Promise<QuoteObj> {
  const returnValue: QuoteObj[] = [];
  const promises = [
    axios.get("https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand"),
    axios.get("https://api.quotable.io/random"),
  ];

  const [quotesondesignPromise, quotableApiPromise] = await Promise.allSettled(promises);

  // if quotesondesign api fulfilled successfully
  if (quotesondesignPromise.status === "fulfilled") {
    const { data } = quotesondesignPromise.value;
    if (data.length > 1) {
      const randomQuoteNum = Math.floor(Math.random() * data.length);
      const {
        window: { document },
      } = new JSDOM(data[randomQuoteNum].content.rendered);

      returnValue.push({
        title: data[randomQuoteNum].title.rendered,
        content: document.querySelector("p").textContent.trim(),
      });
    } else {
      const {
        window: { document },
      } = new JSDOM(data[0].content.rendered);

      returnValue.push({
        title: data[0].title.rendered,
        content: document.querySelector("p").textContent.trim(),
      });
    }
  }

  //if quotable api fulfilled sucessfully
  if (quotableApiPromise.status === "fulfilled") {
    const {
      data: { author, content },
    } = quotableApiPromise.value;

    returnValue.push({ title: author, content });
  }

  // Return one random quote from the array after getting all the quotes
  if (returnValue.length > 1) {
    const rn = Math.floor(Math.random() * returnValue.length);

    return { title: returnValue[rn].title, content: returnValue[rn].content };
  } else {
    return returnValue[0];
  }
}
