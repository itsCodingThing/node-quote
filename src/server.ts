import app from "./app";

const PORT = process.env.PORT || 1729;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
