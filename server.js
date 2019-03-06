const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

let port = process.env.PORT || 3000;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function getQuotes(num) {
  let quote;
  let n = getRandomInt(num);

  quote = await axios
    .get(
      `http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=${n}`
    )
    .then(res => {
      let { data } = res;
      if (data.length > 1) {
        let randomQuote = getRandomInt(data.length);
        return {
          title: data[randomQuote].title,
          content: data[randomQuote].content
        };
      } else {
        return {
          title: data[0].title,
          content: data[0].content
        };
      }
    });

  return quote;
}

app.get("/", (req, res) => {
  getQuotes(10).then(data => {
    res.send(data);
  });
});

app.listen(port, () => {
  console.log("server is running on port 3000");
});
