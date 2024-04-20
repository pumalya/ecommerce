const express = require("express");
const app = express();
 
const pg = require("pg")
const PORT = process.env.PORT || 3000;
const { client, createTables } = require("./db.js");
app.use(require("morgan"), ("dev"))
app.use(express.json());

const init = async()=>{
    await client.connect();

    app.use(router);
    app.listen(PORT, ()=> {
        console.log(`Server is running ${PORT}`);
    });

};

init()