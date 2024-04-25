const { client } = require("./index.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT_SECRET || "shhh";
if (JWT === "shhh") {
  console.log("jwt functional");
}

async function createCarts({ user_id, product_id }) {
  const SQL = `
  INSERT INTO carts 
  (id, user_id, product_id)
  VALUES ($1, $2, $3)
  RETURNING *; 
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  return response.rows[0];
}

async function fetchCarts(user_id ) {
  const SQL = `
    SELECT * 
    FROM carts
    WHERE user_id = $1; `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
}

const deleteCarts = async (user_id, product_id) => {
  const SQL = `
    DELETE 
    FROM carts
    WHERE user_id = $1 AND product_id = $2; 
    `;
  const response = await client.query(SQL, [user_id, product_id]);
  return response.rows;
};

async function findCartsWithToken(token) {
  let id;
  try {
    const payload = jwt.verify(token, JWT);
    id = payload.id;
  } catch (ex) {
    const error = Error("not authorized");
    err.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id FROM carts WHERE id=$1; 
    `;
  const response = await client.query(SQL, [id]);
  if (!response.rows.length) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  return response.rows[0];
}

async function authenticate({ email, password }) {
  const SQL = ` 
  SELECT id, password FROM carts WHERE email=$1; 
  `;
  const response = await client.query(SQL, [email]);
  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const token = jwt.sign({ id: response.rows[0].id }, JWT);
  return { token };
}


module.exports = {
  createCarts,
  fetchCarts,
  deleteCarts,
  findCartsWithToken,
  authenticate,
};