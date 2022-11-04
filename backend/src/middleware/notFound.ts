import { NextFunction, Request, Response } from 'express'
import { NotFound } from '../utils/error'

function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
    next(new NotFound('Request url is not valid'))
}

export { notFoundMiddleware }
