import { Request, Response, NextFunction } from 'express'

import jwt, { JwtPayload } from 'jsonwebtoken'
import { pems } from '../utils/generatePems'

const REGION = process.env.COGNITO_REGION as string
const POOL_ID = process.env.COGNITO_POOL_ID as string
const JWT_ISSUER = `https://cognito-idp.${REGION}.amazonaws.com/${POOL_ID}`
const MAX_TOKEN_AGE = 60 * 60 // 3600 seconds

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Auth')

    if (!token) {
        res.status(401).end()
    } else {
        const decodedJwt = jwt.decode(token, { complete: true })

        if (!decodedJwt) {
            res.status(401).end()
        } else {
            const kid = decodedJwt.header.kid!
            const pem: string | undefined = pems[kid]

            if (!pem) {
                res.status(401).end()
            } else {
                jwt.verify(
                    token,
                    pem,
                    { issuer: JWT_ISSUER, maxAge: MAX_TOKEN_AGE },
                    (err, result) => {
                        if (err) {
                            res.status(401).end()
                        }

                        const payload = result as JwtPayload

                        if (payload.sub) {
                            res.locals.context.user = {
                                id: payload.sub,
                            }
                        }

                        next()
                    }
                )
            }
        }
    }
}

export { authMiddleware }
