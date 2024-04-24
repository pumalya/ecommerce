const express = require("express");
const {
    createUser,
    createTables,
    getAllUsers,
    authenticate,
    userWithToken,
    userWithTokenAdmin, 
    getAllProducts,
    getSingleProduct,
    createProduct,
    deleteProduct,
    addItemToCart,
    fetchCartItems,
    deleteCartItem,
} = require("./Server/db");
const router = express.Router();

const isLoggedin = async (req, res, next) => {
    console.log(req.headers.authorization);
    try {
        const user = await userWithToken(req.headers.authorization);
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await userWithTokenAdmin(req.headers.authorization);
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

router.post("/api/auth/login", async (req, res, next) => {
    try {
        res.send(await authenticate(req.body.username, req.body.password));
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get("/api/products", async (req, res, next) => {
    try {
        res.send(await getAllProducts());
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get("/api/products/:id", async (req, res, next) => {
    try {
        res.send(await getSingleProduct(req.params.id));
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.post(
    "/api/users/:id/cart/:product_id",
    isLoggedin,
    async (req, res, next) => {
        try {
        res.send(
            await addItemToCart(
            req.params.id,
            req.params.product_id,
            req.body.quantity
            )
        );
        res.status(201);
        } catch (err) {
            next(err);
        }
    }
);

router.get("/api/loginForm", isAdmin, async (req, res, next) => {
    try {
        res.send(await getAllUsers());
        res.status(200);
    } catch (err) {
        next(err);
    }
});
router.post("/api/products", isAdmin, async (req, res, next) => {
    try {
        res.send(await createProduct(req.body));
        res.status(201);
    } catch (err) {
        next(err);
    }
});

router.delete("/api/products/:id", isAdmin, (req, res) => {
    try {
        deleteProduct(req.params.id);
        res.status(204);
        res.send("Product deleted");
    } catch (err) {
        next(err);
    }
});

module.exports = router;