import express, { Request, Response } from 'express'

function getHealthCheckRoutes() {
    const router = express.Router()

    router.get('/', getHealthCheck)

    return router
}

function getHealthCheck(req: Request, res: Response) {
    res.status(200).send('Alive and Kickin')
}

export { getHealthCheckRoutes }
