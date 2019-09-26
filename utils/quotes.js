const axios = require("axios");

function getRandomInt(numMax) {
  return Math.floor(Math.random() * numMax);
}

async function getQuotes() {
  let quote = await axios
    .get("https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand")
    .then(function handleResult(res) {
      let { data } = res;
      if (data.length > 1) {
        let randomQuote = getRandomInt(data.length);
        return {
          title: data[randomQuote].title.rendered,
          content: data[randomQuote].content.rendered,
        };
      } else {
        return {
          title: data[0].title.rendered,
          content: data[0].content.rendered,
        };
      }
    });

  return quote;
}

module.exports = {
  getQuotes,
};
