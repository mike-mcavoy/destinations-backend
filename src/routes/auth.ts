import express, { Request, Response } from 'express'

function getAuthRoutes() {
    const router = express.Router()

    router.post('/signup', signUp)

    return router
}

function signUp(req: Request, res: Response) {
    console.log(req.body)
    res.send(true)
}

export { getAuthRoutes }
