const express = require("express");
const cors = require("cors");

const app = express();
const { getQuotes } = require("./utils/quotes");
const { saveQuotes } = require("./utils/database");

app.use(cors());

app.get("/quote", function handleQuoteRoute(req, res) {
  getQuotes().then(function handleResQuote(quote) {
    res.send(quote);
    saveQuotes(quote);
  });
});

module.exports = app;
