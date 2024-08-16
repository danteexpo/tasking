import { get } from 'lodash'
import { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../utils/jwt'
import { reIssueAccessToken } from '../services/session.service'

const deserializeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authorizationHeader = get(req, 'headers.authorization') || ''
    const accessToken = authorizationHeader.startsWith('Bearer ')
        ? authorizationHeader.slice(7).trim()
        : null

    const refreshToken = get(req, 'headers.x-refresh') as string

    if (!accessToken) {
        return next()
    }

    const { decoded, expired } = verifyJwt(accessToken)

    if (decoded) {
        res.locals.user = decoded
        return next()
    }

    if (expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken({ refreshToken })

        if (newAccessToken) {
            res.setHeader('x-access-token', newAccessToken)
        }

        const result = verifyJwt(newAccessToken as string)

        res.locals.user = result.decoded
        return next()
    }

    return next()
}

export default deserializeUser
