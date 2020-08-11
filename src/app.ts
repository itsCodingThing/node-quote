import express from "express";
import cors from "cors";

import homeRouter from "./routers/homeRouter";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", homeRouter);

export default app;
