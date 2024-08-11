import { Request, Response } from 'express'
import { validatePassword } from '../services/user.service'
import { createSession } from '../services/session.service'
import { UserDocument } from '../models/user.model'
import { signJwt } from '../utils/jwt'
// import { CreateUserInput } from '../schemas/user.schema'
// import logger from '../utils/logger'

require('dotenv').config()

export async function createUserSessionHandler(
	req: Request,
	res: Response
) {
	const accessTokenTtl = process.env.ACCESSTOKENTTL

	if (!accessTokenTtl) {
		console.error('ACCESSTOKENTTL environment variable is not set')
		return
	}

	// Validating user's password
	const user = await validatePassword(req.body) as { _id: string } & Omit<UserDocument, 'password'>

	if (!user) {
		return res.status(401).send('Invalid email or password')
	}

	// Creating a session
	const session = await createSession(user._id, req.get('user-agent') || '')

	// Creating an access token
	const accessToken = signJwt({
		...user, session: session._id
	},
		{ expiresIn: accessTokenTtl }
	)

	// Creating a refresh token
	const refreshToken = signJwt({
		...user, session: session._id
	},
		{ expiresIn: accessTokenTtl }
	)

	// Returning access & refresh tokens
	return res.send({ accessToken, refreshToken })
}
