import express from 'express'
import cors from 'cors'
import routes from './routes'
import connect from './utils/connect'
import logger from './utils/logger'
import deserializeUser from './middleware/deserializeUser'
import { config } from 'dotenv'

config()

const port = process.env.PORT

if (!port) {
    throw new Error('PORT environment variable is not set')
}

const app = express()

app.use(express.json())

app.use(cors())

app.use(deserializeUser)

app.listen(port, async () => {
    logger.info(`App is running at http://localhost:${port}`)

    await connect()

    routes(app)
})
