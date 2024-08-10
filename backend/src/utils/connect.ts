import mongoose from 'mongoose'

require('dotenv').config()

async function connect(){
    const dbUri = process.env.dbUri

    try {
	await mongoose.connect(dbUri)
	console.log('Connected to db')
    }
    catch {
	console.log('Could not connect to db')
	process.exit(1)
    }
}

export default connect
