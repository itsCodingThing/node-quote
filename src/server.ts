import { existsSync, writeFileSync } from "fs";
import { resolve } from "path";
import axios from "axios";
import app from "./app";

const PORT = process.env.PORT || 1729;
const gistURL =
  "https://gist.githubusercontent.com/itsCodingThing/9a2c7d69d792340a973c704411cb7bf3/raw/1870997a70ee90635b43628c4a7c0c94d940811e/quote-database.json";

async function server() {
  if (!existsSync(resolve(__dirname, "quote-database.json"))) {
    const { data } = await axios.get(gistURL);
    const json = JSON.stringify(data);

    writeFileSync(resolve(__dirname, "quote-database.json"), json);
  }

  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}

server();
