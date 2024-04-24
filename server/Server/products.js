const { client } = require("./index.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT_SECRET || "shhh";
if (JWT === "shhh") {
    console.log("jwt functional");
}

async function createProducts({ price, password }) {
    const SQL = `
    INSERT INTO products(price, password) VALUES($1, $2, $3) RETURNING * `;
    const response = await client.query(SQL, [
    uuid.v4(),
    price,
    await bcrypt.hash(password, 5),
    ]);
    return response.rows[0];
}

async function fetchProducts() {
    const SQL = `
    SELECT id, price FROM products; `;
    const response = await client.query(SQL);
    return response.rows;
}

async function findProductsWithToken(token) {
    let id;
    try {
    const payload = jwt.verify(token, JWT);
    id = payload.id;
    } catch (ex) {
    const err = Error("not authorized");
    err.status = 401;
    throw err;
    }
    const SQL = `
    SELECT id, price FROM products WHERE id=$1; `;
    const response = await client.query(SQL, [id]);
    if (!response.rows.length) {
    const err = Error("not authorized");
    err.status = 401;
    throw err;
    }
    return response.rows[0];
}

async function authenticate({ id, password }) {
    const SQL = `
    SELECT id, price, password FROM products WHERE price=$1; `;
    const response = await client.query(SQL, [id]);
    if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
    ) {
    const err = Error("not authorized");
    err.status = 401;
    throw err;
    }
    const token = jwt.sign({ id: response.rows[0].id }, JWT);
    return { token };
}

module.exports = {
    createProducts,
    fetchProducts,
    findProductsWithToken,
    authenticate,
};