const axios = require("axios");

async function getQuotes() {
  let quote = await axios
    .get("https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand")
    .then(function handleResult(res) {
      let { data } = res;
      if (data.length > 1) {
        let randomQuote = getRandomInt(data.length);
        return {
          title: data[randomQuote].title,
          content: data[randomQuote].content,
        };
      } else {
        return {
          title: data[0].title,
          content: data[0].content,
        };
      }
    });

  return quote;
}

module.exports = {
  getQuotes,
};
