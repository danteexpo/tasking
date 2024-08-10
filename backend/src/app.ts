import express from "express"
import connect from "./utils/connect"

require('dotenv').config()

const port = process.env.PORT

const app = express()

app.listen(port, async () => {
    console.log('App is running')

    await connect()
})
