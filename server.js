const express = require("express");
const cors = require("cors");
const app = express();
const { getQuotes } = require("./utils/quotes");
const { saveQuotes } = require("./utils/database");

app.use(cors());

let port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("my random api");
});

app.get("/quote", (req, res) => {
  getQuotes(10).then(data => {
    res.send(data);
    saveQuotes(data);
  });
});

app.listen(port, () => {
  console.log("server is running on port 3000");
});
