import { NextFunction, Request, Response } from 'express'
import { ApiResponse } from '../utils/response'

function responseMiddleware(req: Request, res: Response, next: NextFunction) {
    const response = res.locals.response

    if (response instanceof ApiResponse) {
        return res.status(response.status).json(response.getResponseObject())
    }

    next()
}

export { responseMiddleware }
