import express, { NextFunction, Request, Response } from 'express'
import { ApiResponse } from '../utils/response'

function getHealthCheckRoutes() {
    const router = express.Router()

    router.get('/', healthCheck)

    return router
}

function healthCheck(req: Request, res: Response, next: NextFunction) {
    res.locals.response = new ApiResponse('Hello World 🌎')
    next()
}

export { getHealthCheckRoutes }
