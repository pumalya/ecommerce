const express = require("express");
const cors = require("cors");

const loginRouter = express.Router();

const bcrypt = require("bcrypt");
const { authenticate } = require("../Server/user.js");

loginRouter.use(cors());

loginRouter.post("/", async function (req, res) {
  try {
    console.log("login works");
    const token = await authenticate({
      email: req.body.email,
      password: req.body.password,
    });

    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(1000).json({ error });
  }
});

module.exports = loginRouter;