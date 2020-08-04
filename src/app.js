const express = require("express");
const cors = require("cors");
const { getQuotes } = require("./utils/quotes");
const { saveQuotes } = require("./utils/database");

const app = express();

app.use(cors());

app.get("/quote", (req, res) => {
  getQuotes().then((quote) => {
    res.send(quote);
    saveQuotes(quote);
  });
});

app.get("/", (req, res) => {
  res.send("I think you try this route /quote");
});

module.exports = app;
