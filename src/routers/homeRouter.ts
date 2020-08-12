import express from "express";

import { getQuotes, QuoteObj } from "../utils/utils";
import { saveQuotes } from "../utils/database";

const homeRouter = express.Router();

homeRouter.get("/", (req, res) => {
  res.send(`you are looking for this`);
});

homeRouter.get("/quote", (req, res) => {
  getQuotes().then((quote: { title: string; content: string }) => {
    res.send(quote);
    saveQuotes(quote);
  });
});

homeRouter.post("/save", (req, res) => {
  const { title = "", content = "" }: QuoteObj = req.body;

  if (title && content) {
    // db.saveQuotes({ title, content });
    res.send(`${title}-${content}`);
  } else {
    res.status(500).send("please provide complete details");
  }
});

export default homeRouter;
