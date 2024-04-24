const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL||"postgres://localhost/ecommerce");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { query } = require("express");
const uuid = require("uuid");
const JWT = process.env.JWT || "shhh";

const { categories, products } = require("../seeds");

const dropTables = async()=>{
    const SQL = `
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS categories;
        DROP TABLE IF EXISTS carts;
        DROP TABLE IF EXISTS quantity;
        DROP TABLE IF EXISTS users;
        `;
        await client.query(SQL);
};
        
const createTables = async()=> {
    const SQL = `
        CREATE TABLE users(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
        );

        CREATE TABLE carts(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES user(id),
            product_id UUID REFERENCES products(id),
            CONSTRAINT unique_product_user UNIQUE (user_id, product_id)
        );

        CREATE TABLE categories(
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(255) NOT NULL
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

const createUser = async({username, password})=> {
    const SQL = `
        INSERT INTO users (username, password, email, isAdmin)
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

const fetchUser = async(id)=> {
    return(await client.query(`SELECT * FROM users WHERE id = $1;`, [id]))
    .rows[0];
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
    INSERT INTO products (name, price, category, quantity)
    VALUES ($1, $2, $3, $4)
    RETURNING * ;`;

    const newProduct = await client.query(SQL, [
        product.name,
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

const createCategory = async (name) => {
    const response = await client.query(
        `INSERT INTO categories(name) VALUES($1) RETURNING *;`,
        [name]
    );
    return response.rows[0];
};

const createCategories = async (categories) => {
    for (let i = 0; i < categories.length; i++) {
        console.log(await createCategory(categories[i]));
    }
};

const fetchCategory = async (id) => {
    return (await client.query(`SELECT * FROM categories WHERE id = $1;`, [id]))
        .rows[0];
};

const fetchCategoryId = async (name) => {
    return (
        await client.query(`SELECT id FROM categories WHERE name = $1;`, [name])
    ).rows[0].id;
};

const fetchCategories = async () => {
    const response = await client.query(`SELECT * FROM categories;`);
    return response.rows;
};

const deleteCategory = async (id) => {
    await client.query(`DELETE FROM categories WHERE id = $1`, [id]);
};


module.exports = {
    client,
    createUser,
    createTables,
    getAllUsers,
    authenticate,
    userWithToken,
    userWithTokenAdmin, 
    fetchUser,
    getAllProducts,
    getSingleProduct,
    createProduct,
    deleteProduct,
    addItemToCart,
    fetchCartItems,
    deleteCartItem,
    createCategories,
    createCategory,
    fetchCategory,
    fetchCategoryId,
    fetchCategories,
    deleteCategory,
};