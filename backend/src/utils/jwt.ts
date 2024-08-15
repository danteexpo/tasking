import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config()

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
    const private_key = process.env.PRIVATE_KEY

    if (!private_key) {
        throw new Error('PRIVATE_KEY environment variable is not set')
    }

    return jwt.sign(object, private_key, {
        ...(options && options),
        algorithm: 'RS256',
    })
}

export function verifyJwt(token: string) {
    const public_key = process.env.PUBLIC_KEY

    if (!public_key) {
        throw new Error('PUBLIC_KEY environment variable is not set')
    }

    try {
        const decoded = jwt.verify(token, public_key)
        return {
            valid: true,
            expired: false,
            decoded,
        }
    } catch (e: any) {
        console.error(e)
        return {
            valid: false,
            expired: e.message === 'jwt expired',
            decoded: null,
        }
    }
}
