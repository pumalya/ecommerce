const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL||"postgres://localhost/ecommerce");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { query } = require("express");
const { v4: uuidv4 } = require("uuid");
const JWT = process.env.JWT || "shhh";

const dropTables = async()=>{
    const SQL = `
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS productImages;
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

        CREATE TABLE productImages(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            product_id UUID REFERENCES products(id)
        );
        
        CREATE TABLE products(
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            price DECIMAL NOT NULL,
        );
    `;
    await client.query(SQL);
};

const seedUsers = async()=> {
    const SQL = `
    INSERT INTO users (name, password, email) VALUES 
        ("Tim", $1, "atim@gmail.uk"),
        ("Allen", $2, "ballen@gmail.uk"),
        ("Violet", $3, "mviolet@gmail.uk"),
        ("Moon", $4, "kaymoon@gmail.uk"),
        ("Kayla", $5, "jkayla@gmail.uk"),
        ("Roy", $6, "wwroy@gmail.uk"),
        ("Layla", $7, "hlayla@gmail.uk"),
        ("Eugene", $8, "qeugene@gmail.uk"),
        ("Woodhy", $9, "bwoodhy@gmail.uk")
        RETURNING * ;
    `;

    const result = await client.query(SQL, [
        await bcrypt.hash("password", 7),
        await bcrypt.hash("password", 7),
        await bcrypt.hash("password", 7),
        await bcrypt.hash("password", 7),
        await bcrypt.hash("password", 7),
        await bcrypt.hash("password", 7),
        await bcrypt.hash("password", 7),
        await bcrypt.hash("password", 7),
        await bcrypt.hash("password", 7)
    ]);
    return result.rows;
};

const seedProducts = async()=> {
    const SQL = `
    INSERT INTO products (name, price) VALUES
    ("Charizard5", "140"),
    ("Charizard8", "220"),
    ("Charizard9", "300"),
    ("Charizard10", "500"),
    ("Dragonite10", "400"),
    ("Gengar10", "350"),
    ("Groudon9", "180"),
    ("Lugia9", "220"),
    ("Mewtwo9", "330"),
    ("Pikachu10", "700"),
    ("Rayquaza9", "150"),
    ("Scizor8", "290"),
    ("Suicune10", "400"),
    ("Typhlosion9", "110"),
    ("Umbreon9", "650"),
    ("Venusaur10", "350")
    RETURNING * ;
    `;
    const result = await client.query(SQL);
    return result.rows;
};

const seedProductImages = async(products)=> {
    const queryParams = [
        products[0].id,
        "Charizard5.jpg", 
        products[1].id,
        "Charizard8.jpg",
        products[2].id, 
        "Charizard9.jpg",
        products[3].id, 
        "Charizard10.jpg", 
        products[4].id,
        "Dragonite10.jpg", 
        products[5].id,
        "Gengar10.jpg",
        products[6].id,
        "Groudon9.jpg",
        products[7].id,
        "Lugia9.jpg",
        products[8].id,
        "Mewtwo9.jpg", 
        products[9].id,
        "Pikachu10.jpg", 
        products[10].id,
        "Rayquaza9.jpg",
        products[11].id, 
        "Scizor8.jpg", 
        products[12].id,
        "Suicune10.jpg", 
        products[13].id,
        "Typhlosion9.jpg",
        products[14].id,
        "Umbreon9.jpg",
        products[15].id,
        "Venusaur10.jpg"
    ];
    const SQL = `
    INSERT INTO productImages (product_id, name) VALUES
    ($1,$2),
    ($3,$4),
    ($5,$6),
    ($7,$8),
    ($9,$10),
    ($11,$12),
    ($13,$14),
    ($15,$16),
    ($17,$18),
    ($19,$20),
    ($21,$22),
    ($23,$24),
    ($25,$26),
    ($27,$28),
    ($29,$30),
    ($31,$32)
    RETURNING *
    `;
    await client.query(SQL, queryParams);
};
const seedCarts = async (users, products) => {
    const queryParams = [
        users[0].id,
        products[0].id,
        users[0].id,
        products[1].id,
        users[1].id,
        products[2].id,
    ];
    const SQL = ` 
    INSERT INTO carts (user_id,product_id) VALUES ($1,$2),
    ($3,$4),
    ($5,$6);
    
    `;
    await client.query(SQL, queryParams);
};
const seed = async () => {
    const SQL = await dropTables();
    await createTables();
    const seedTestUsers = await seedUsers();
    console.log("seedUsers", seedTestUsers);
    const seedTestProducts = await seedProducts();
    console.log("seedProducts", seedTestProducts);
    await seedCarts(seedTestUsers, seedTestProducts);
    await seedProductImages(seedTestProducts);
};
const authenticateUser = async (username, password) => {
    const SQL = `
        SELECT id, password
        FROM users
        WHERE name = $1
        `;
    const response = await client.query(SQL, [username]);
    userInfo = response.rows;
    if (
        userInfo.length ||
        (await bcrypt.compare(userInfo[0].password, password))
    ) {
        const error = Error("Not Authorized");
        error.status = 401;
        throw error;
    }
    const token = await jwt.sign({ id: response.rows[0].id }, JWT);
    console.log(token, "here");
    return { token: token };
};

const createUser = async (name, password) => {
    const SQL = `
    INSERT INTO  users (name, password) 
    VALUES ($1, $2)
    RETURNING *;
    `;
    const response = await client.query(
        SQL,
        [name, password][await bcrypt.hash("password", 7)]
    );
    return response.rows;
};
const createProducts = async (products_id) => {
    const SQL = `
    INSERT INTO  products (price) 
    VALUES ($1, $2)
    RETURNING *;
    `;
    const response = await client.query(
        SQL,
        [await bcrypt.hash("password", 7)],
        [products_id]
    );
    return response.rows;
};
const fetchUsers = async (user_id) => {
    const SQL = `
        SELECT * from users
        WHERE id =$1
        `;
    const response = await client.query(SQL, [user_id]);
    return response.rows;
};
const fetchProducts = async () => {
    const SQL = `
        SELECT * from products;
        `;
    const response = await client.query(SQL);
    return response.rows;
};
const fetchProductsById = async (products_id) => {
    const SQL = `
        SELECT * from products
        WHERE id =$1
        `;
    const response = await client.query(SQL, [products_id]);
    return response.rows;
};
const fetchCarts = async (user_id, products_id) => {
    const SQL = `
    SELECT * 
    FROM carts
    WHERE user_id = $1 AND product_id = $2;
    `;
    const response = await client.query(SQL, [user_id, products_id]);
    return response.rows;
};
const createCarts = async ({ user_id ,product_id}) => {
    const id = uuidv4();
    const SQL = `
        INSERT INTO carts 
        (id, user_id, product_id)
        VALUES ($1, $2, $3)
        RETURNING *;
        `;
    const response = await client.query(SQL, [id, user_id, product_id]);
    return response.rows[0];
};
const deleteCarts = async (user_id, products_id) => {
    const SQL = `
        DELETE 
        FROM carts
        WHERE user_id = $1 AND product_id = $2;
        `;
    const response = await client.query(SQL, [user_id, products_id]);
    return response.rows;
};
const fetchProductsImages = async (products_id) => {
    const SQL = `
        SELECT * from productImages
        where id =$1
        `;
    const response = await client.query(SQL, [products_id]);
};
const fetchAllProductsImages = async () => {
    const SQL = `
        SELECT * FROM productImages;
        `;
    const response = await client.query(SQL);
    return response.rows;
};
const Carts = async (user_id, product_id) => {
    const SQL = `
        INSERT INTO users_products(id, user_id,product_id)
        VALUES($1 ,$2, $3)
        `;
    const response = await client.query(SQL, [uuidv4(), user_id, product_id]);
    return response.rows;
};

module.exports = {
    seed,
    client,
    fetchProductsImages,
    fetchAllProductsImages,
    authenticateUser,
    createUser,
    createProducts,
    createCarts,
    deleteCarts,
    fetchUsers,
    fetchProducts,
    fetchProductsById,
    fetchCarts,
    Carts,
};