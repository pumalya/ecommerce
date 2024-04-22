const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL||"postgres://localhost/ecommerce");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const JWT = process.env.JWT || "shhh";

const createTables = async()=>{
    const SQL = `
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS carts;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS order_items;
        DROP TABLE IF EXISTS users;

        CREATE TABLE users(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
        );

        CREATE TABLE order_items (
            id SERIAL PRIMARY KEY,
            order_id INT REFERENCES order(id),
            product_id INT REFERENCES products(id),
            quantity INT,
            price DECIMAL
        );
        
        CREATE TABLE orders (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES user(id),
            total_price DECIMAL,
            status VARCHAR
        );

        CREATE TABLE carts(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES user(id),
            quantity INT
        );

        
        CREATE TABLE products(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50),
            description TEXT,
            price DECIMAL NOT NULL,
            category VARCHAR(50),
            quantity INT
        );
    `;
    await client.query(SQL);
};

const createUser = async(user)=> {
    const SQL = `
        INSERT INTO users (username, password, email)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const hash = await bcrypt.hash(user.password, 7);
    const values = [user.username, user.password, user.email, hash];
    const response = await client.query(SQL, values);
    return response[0];
};

const getAllUsers = async()=> {
    const SQL = `SELECT * FROM users;`;
    const response = await client.query(SQL);
    return response.rows;
};
const authenticate = async ({username, password}) => {
    const user = await client.query(
        `SELECT * FROM users WHERE username = $1`,
        [username]
    );
    if (user.rows.length === 0) {
        throw err("Please enter valid username or create an account");
    }
    const match = await bcrypt.compare(password, user.rows[0].password);
    if (match) {
        const token = jwt.sign(
            { user: user.rows[0] }, 
            user.rows[0].is_admin ? JWT_ADMIN : JWT_CLIENT
        );
        return token;
    } else {
        throw err("Incorrect password, please try again");
    }
};

const userWithToken = async(token)=> {
    try {
        const payload = jwt.verify(token, JWT_CLIENT);
        return payload;
    } catch (err) {
        throw err("token error");
    }
};

const userWithTokenAdmin = async(token)=> {
    try {
        const payload = jwt.verify(token, JWT_ADMIN);
        return payload;
    } catch (err) {
        throw err("token error");
    }
};

const getAllProducts = async()=> {
    const SQL = `SELECT * FROM products;`;
    const response = await client.query(SQL);
    return response.rows;
};

const getSingleProduct = async()=> {
    const SQL = `SELECT * FROM products WHERE id = $1;`;
    const response = await client.query(SQL, [id]);
    return response.rows[0];
};

const createProduct = async()=> {
    const SQL = `
    INSERT INTO products (name, description, price, category, quantity)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING * ;`;

    const newProduct = await client.query(SQL, [
        product.name,
        product.description,
        product.price,
        product.category,
        product.quantity,
    ]);
    return newProduct.rows[0];
};

const deleteProduct = async(id)=> {
    const SQL = `DELETE FROM products WHERE id = $1;`;
    const response = await client.query(SQL, [id]);
    return response;
};

const addItemToCart = async(userId, productId, quantity)=> {
    const cart_id = await getCartId(user_id);
    let currentQuantity = await fetchCartItemQuantity(cart_id, product_id);
    if (currentQuantity === 0) {
        response = await client.query(
            `INSERT INTO cartItems(cart_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *;`,
            [cart_id, product_id, quantity]
        );

        return quantity;
    } else {
        response = await updateCartItemQuantity(
            cart_id,
            product_id,
            currentQuantity + quantity
        );

        return currentQuantity + quantity;
}}

const fetchCartItems = async (cart_id) => {
    const response = await client.query(
        `SELECT * FROM cartItems WHERE cart_id = $1;`,
        [cart_id]
    );

    return response.rows;
};

const deleteCartItem = async (cart_id, product_id) => {
    await client.query(
        `DELETE FROM cartItems WHERE cart_id = $1 AND product_id = $2;`,
        [cart_id, product_id]
    );
};


module.exports = {
    client,
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
};