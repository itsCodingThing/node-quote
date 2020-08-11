import express from "express";
import cors from "cors";
import { getQuotes, QuoteObj } from "./utils/quotes";
import db from "./utils/database";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/quote", (req, res) => {
  getQuotes().then((quote: { title: string; content: string }) => {
    res.send(quote);
    db.saveQuotes(quote);
  });
});

app.post("/save", (req, res) => {
  const { title = "", content = "" }: QuoteObj = req.body;

  if (title && content) {
    // db.saveQuotes({ title, content });
    res.send(`${title}-${content}`);
  } else {
    res.status(500).send("please provide complete details");
  }
});

export default app;
