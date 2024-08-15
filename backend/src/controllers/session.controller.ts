import { Request, Response } from 'express'
import { validatePassword } from '../services/user.service'
import {
    createSession,
    findSessions,
    updateSession,
} from '../services/session.service'
import { UserDocument } from '../models/user.model'
import { signJwt } from '../utils/jwt'
import { config } from 'dotenv'
import logger from '../utils/logger'

config()

export async function createUserSessionHandler(req: Request, res: Response) {
    const accessTokenTtl = process.env.ACCESSTOKENTTL
    const refreshTokenTtl = process.env.REFRESHTOKENTTL

    if (!accessTokenTtl) {
        throw new Error('ACCESSTOKENTTL environment variable is not set')
    }

    if (!refreshTokenTtl) {
        throw new Error('REFRESHTOKENTTL environment variable is not set')
    }

    try {
        const user = (await validatePassword(req.body)) as {
            _id: string
        } & Omit<UserDocument, 'password'>

        if (!user) {
            return res.status(401).send('Invalid email or password')
        }

        const session = await createSession(
            user._id,
            req.get('user-agent') || ''
        )

        const accessToken = signJwt(
            {
                ...user,
                session: session._id,
            },
            { expiresIn: accessTokenTtl }
        )

        const refreshToken = signJwt(
            {
                ...user,
                session: session._id,
            },
            { expiresIn: refreshTokenTtl }
        )

        return res.send({ accessToken, refreshToken })
    } catch (error) {
        logger.error('Error during session creation', error)
        return res
            .status(500)
            .send('An error occurred while creating the session')
    }
}

export async function getUserSessionsHandler(_req: Request, res: Response) {
    try {
        const userId = res.locals.user._id

        const sessions = await findSessions({ user: userId, valid: true })

        return res.send(sessions)
    } catch (error) {
        logger.error('Error fetching user sessions', error)
        return res
            .status(500)
            .send('An error occurred while fetching user sessions')
    }
}

export async function deleteSessionHandler(_req: Request, res: Response) {
    try {
        const sessionId = res.locals.user.session

        await updateSession({ _id: sessionId }, { valid: false })

        return res.send({
            accessToken: null,
            refreshToken: null,
        })
    } catch (error) {
        logger.error('Error deleting session', error)
        return res
            .status(500)
            .send('An error occurred while deleting the session')
    }
}
