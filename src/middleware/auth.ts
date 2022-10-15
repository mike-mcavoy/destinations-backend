import { Request, Response, NextFunction } from 'express'

import jwt from 'jsonwebtoken'
import { pems } from '../utils/generatePems'

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
                jwt.verify(token, pem, (err) => {
                    if (err) {
                        res.status(401).end()
                    }
                    next()
                })
            }
        }
    }
}

export { authMiddleware }
