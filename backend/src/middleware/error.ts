import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { ApiError } from '../utils/error'

const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ApiError) {
        return res.status(err.getStatusCode()).json(err.getResponseObject())
    }

    //TODO: Need a better way of handling Zod errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            status: 400,
            message: err.format(),
        })
    }

    return res.status(500).json({
        status: 500,
        message: err.message,
    })
}

export { errorMiddleware }
