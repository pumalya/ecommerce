const express = require("express");

const productsRouter = express.Router();
const client = require("../Server/db");

productsRouter.get(async (req, res, next) => {
    try {
        res.send(await client.fetchProducts());
    } catch (error) {
        next(error);
    }
});

productsRouter.post("/", async (req, res, next) => {
    try {
        res.send(await client.createProducts(req.body));
    } catch (error) {
        next(error);
    }
});

productsRouter.get("/", async (req, res, next) => {
    try {
        const productImages = await client.fetchAllProductsImages();
        const products = await client.fetchProducts(req.body);

        for (const product of products) {
            const imageNames = productImages
            .filter((image) => image.product_id === product.id)
            .map((image) => image.name);
            product.images = imageNames;
        }
        res.send(products);
    } catch (error) {
        next(error);
    } 
});

productsRouter.get("/:id", async (req, res, next) => {
    try {
        res.send(await client.fetchProducts(req.params.id));
    } catch (error) {
        next(error);
    }
});

module.exports = productsRouter;