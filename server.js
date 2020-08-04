const app = require("./src/app");

const PORT = process.env.PORT || 1729;

app.listen(PORT, function listener() {
  console.log(`server is running on port ${PORT}`);
});
