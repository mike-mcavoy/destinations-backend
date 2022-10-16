import express, { Request, Response } from 'express'

function getHealthCheckRoutes() {
    const router = express.Router()

    router.get('/', healthCheck)

    return router
}

function healthCheck(req: Request, res: Response) {
    res.status(200).send('Hello World 🌎')
}

export { getHealthCheckRoutes }
