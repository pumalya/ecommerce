const express = require("express");

const cartsRouter = express.Router();
const client = require("../Server/db");

cartsRouter.get(async (req, res, next) => {
    try {
        res.send(await client.fetchCarts());
    } catch (error) {
        next(error);
    }
});

cartsRouter.post("/", async (req, res, next) => {
    try {
        res.send(await client.createCarts(req.body));
    } catch (error) {
        next(error);
    }
});

cartsRouter.delete("/:id", async (req, res, next) => {
    try {
        res.send(await client.deleteCarts(req.params.id));
    } catch (error) {
        next(error);
    }
});

cartsRouter.get("/:id", async (req, res, next) => {
    try {
        res.send(await client.fetchCarts(req.params.id));
    } catch (error) {
        next(error);
    }
});

module.exports = cartsRouter;