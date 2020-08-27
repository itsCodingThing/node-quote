import express from "express";

import { fetchQuote, QuoteObj } from "../utils/utils";

const homeRouter = express.Router();

homeRouter.get("/", (_req, res) => {
  res.send(`you are looking for this /quote url`);
});

homeRouter.get("/quote", async (_req, res) => {
  try {
    const quote = await fetchQuote();
    res.send(quote);
  } catch {
    res.send({ title: "noop!!!", content: "there must be some problem in api please try again" });
  }
});

homeRouter.post("/add_quote", (req, res) => {
  const { title = "", content = "" }: QuoteObj = req.body;

  if (title && content) {
    res.send(`${title}-${content}`);
  } else {
    res.status(500).send("please provide complete details");
  }
});

export default homeRouter;
