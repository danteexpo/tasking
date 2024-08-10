import express from 'express'
import connect from './utils/connect'
import logger from './utils/logger'
import routes from './routes'

require('dotenv').config()

const port = process.env.PORT

const app = express()

app.use(express.json())

app.listen(port, async () => {
	logger.info(`App is running at http://localhost:${port}`)

	await connect()

	routes(app)
})
