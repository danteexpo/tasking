import { Request, Response } from 'express'
import { validatePassword } from '../services/user.service'
import { createSession, findSessions, updateSession } from '../services/session.service'
import { UserDocument } from '../models/user.model'
import { signJwt } from '../utils/jwt'

require('dotenv').config()

export async function createUserSessionHandler(
	req: Request,
	res: Response
) {
	const accessTokenTtl = process.env.ACCESSTOKENTTL
	const refreshTokenTtl = process.env.REFRESHTOKENTTL

	if (!accessTokenTtl) {
		console.error('ACCESSTOKENTTL environment variable is not set')
		return
	}

	if (!refreshTokenTtl) {
		console.error('REFRESHTOKENTTL environment variable is not set')
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
		{ expiresIn: refreshTokenTtl }
	)

	// Returning access & refresh tokens
	return res.send({ accessToken, refreshToken })
}

export async function getUserSessionsHandler(req: Request, res: Response) {
	const userId = res.locals.user._id

	const sessions = await findSessions({ user: userId, valid: true })

	return res.send(sessions)
}

export async function deleteSessionHandler(req: Request, res: Response) {
	const sessionId = res.locals.user.session

	await updateSession({ _id: sessionId }, { valid: false })

	return res.send({
		accessToken: null,
		refreshToken: null
	})
}
