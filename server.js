const express = require("express");
const cors = require("cors");

const app = express();
const { getQuotes } = require("./utils/quotes");
const { saveQuotes } = require("./utils/database");

const PORT = process.env.PORT || 1729;

app.use(cors());

app.get("/quote", function handleQuoteRoute(req, res) {
  getQuotes().then(function handleResQuote(quote) {
    res.send(quote);
    saveQuotes(quote);
  });
});

app.listen(PORT, function listener() {
  console.log(`server is running on port ${PORT}`);
});
