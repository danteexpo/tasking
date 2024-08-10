import mongoose from 'mongoose'
import logger from './logger'

require('dotenv').config()

async function connect() {
	const dbUri: string | undefined = process.env.DBURI

	if (!dbUri) {
		logger.error('DBURI environment variable is not set')
		process.exit(1)
	}

	try {
		await mongoose.connect(dbUri)
		logger.info('Connected to db')
	}
	catch {
		logger.error('Could not connect to db')
		process.exit(1)
	}
}

export default connect
