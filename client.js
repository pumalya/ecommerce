const pg = require('pg')
// remember to change the db name in this link to whatever you name the db while developing
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/ecommerce')

module.exports = { client }