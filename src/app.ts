import express from "express";
import cors from "cors";
import { getQuotes } from "./utils/quotes";
import db from "./utils/database";

const app = express();

app.use(cors());

app.get("/quote", (req, res) => {
  getQuotes().then((quote: { title: string; content: string }) => {
    res.send(quote);
    db.saveQuotes(quote);
  });
});

app.get("/", (req, res) => {
  res.send("I think you try this route /quote");
});

export default app;
