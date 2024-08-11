import jwt from 'jsonwebtoken'

require('dotenv').config()

export function signJwt(
	object: Object,
	// keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
	options?: jwt.SignOptions | undefined
) {
	const private_key = process.env.PRIVATE_KEY

	if (!private_key) {
		console.error('PRIVATE_KEY environment variable is not set')
		return
	}

	/*
	const signingKey = Buffer.from(
		private_key,
		'base64'
	).toString('ascii')
	*/

	return jwt.sign(object, private_key, {
		...(options && options),
		algorithm: 'RS256',
	})
}

export function verifyJwt(
	token: string,
	keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
) {
	const public_key = process.env.PUBLIC_KEY

	if (!public_key) {
		return
	}

	/*
	const publicKey = Buffer.from(public_key, 'base64').toString(
		'ascii'
	)
	*/

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
