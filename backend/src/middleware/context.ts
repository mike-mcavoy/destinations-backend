import { NextFunction, Request, Response } from 'express'

function contextMiddleware(req: Request, res: Response, next: NextFunction) {
    res.locals.context = {}
    next()
}

export { contextMiddleware }
