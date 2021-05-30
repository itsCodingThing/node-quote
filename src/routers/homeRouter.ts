import express from "express";

import { fetchQuote, sendServerResponse } from "../utils/utils";
import { save } from "../utils/database";
import { QuoteObj } from "../utils/interfaces";

const homeRouter = express.Router();

homeRouter.get("/", (_req, res) => {
    res.send(`you are looking for this /quote url`);
});

homeRouter.get("/quote", async (_req, res) => {
    try {
        const quote = await fetchQuote();
        const savedQuote = await save(quote);
        res.send(sendServerResponse({ ok: true, response: savedQuote }));
    } catch {
        res.send(
            sendServerResponse({
                ok: false,
                error: "There must be some problem with backend",
            }),
        );
    }
});

homeRouter.post("/add_quote", (req, res) => {
    const { title = "", content = "" }: QuoteObj = req.body;

    if (title && content) {
        res.send(`${title}-${content}`);
    } else {
        res.status(500).send("please provide complete details");
    }
});

export default homeRouter;
