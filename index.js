const express = require('express')
const { client } = require('./client.js')
const app = express()

const init = async () => {
    const port = process.env.PORT || 3000
    await client.connect()

    app.listen(port, () => console.log(`\nlistening on port ${port}`))
}

init()