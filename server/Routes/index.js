const cartsRouter = require("./cartsRoutes.js");
const productsRouter = require("./productsRoutes.js");
const registerRouter = require("./registerRoutes.js");
const loginRouter = require("./loginRoutes.js");

const apiRouter = require("express").Router();

apiRouter.use("/auth", require("./auth.js"));

apiRouter.use("/cart", cartsRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/register", registerRouter);
apiRouter.use("/loginform", loginRouter);

module.exports = apiRouter;