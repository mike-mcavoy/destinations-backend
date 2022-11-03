import { NextFunction, Request, Response } from 'express'

function contextMiddleware(req: Request, res: Response, next: NextFunction) {
    req.context = {}
    next()
}

export { contextMiddleware }
