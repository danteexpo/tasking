import mongoose from 'mongoose'
import logger from './logger'
import { config } from 'dotenv'

config()

async function connect() {
    const dbUri = process.env.DBURI

    if (!dbUri) {
        throw new Error('DBURI environment variable is not set')
    }

    try {
        await mongoose.connect(dbUri)
        logger.info('Connected to db')
    } catch (error) {
        logger.error('Could not connect to db', error)
        process.exit(1)
    }
}

export default connect
