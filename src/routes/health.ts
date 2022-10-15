import express, { Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth'

function getHealthCheckRoutes() {
    const router = express.Router()

    router.get('/', authMiddleware, healthCheck)

    return router
}

function healthCheck(req: Request, res: Response) {
    res.status(200).send('Hello World 🌎')
}

export { getHealthCheckRoutes }
