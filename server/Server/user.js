const { client } = require("./db.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT_SECRET || "shhh";
if (JWT === "shhh") {
    console.log("jwt is working");
}

async function createUser({ name, password, email }) {
    const SQL = `
    INSERT INTO users(id, name, password, email) VALUES($1, $2, $3, $4) RETURNING * `;
    const response = await client.query(SQL, [
        uuid.v4(),
        name,
        await bcrypt.hash(password, 7),
        email,
    ]);
    return response.rows[0];
}

async function fetchUsers() {
    const SQL = `
    SELECT id, name FROM users; `;
    const response = await client.query(SQL);
    return response.rows;
}

async function isLoggedIn(req, res, next) {
    try {
        req.user = await findUserWithToken(req.headers.authorization);
        next();
    } catch (ex) {
        next(ex);
    }
}

async function findUserWithToken(token) {
    let id;
    try {
        const payload = jwt.verify(token, JWT);
        id = payload.id;
    } catch (ex) {
        const error = Error("not authorized");
        error.status = 401;
        throw error;
    }
    const SQL = `
    SELECT id, name FROM users
    WHERE id = $1; 
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
    SELECT id, email, password FROM users WHERE email=$1; 
    `;
    const response = await client.query(SQL, [email]);
    console.log(response.rows[0]);
    console.log(password);
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
    createUser,
    fetchUsers,
    isLoggedIn,
    findUserWithToken,
    authenticate,
};