import express, { Request, Response } from 'express'
import z from 'zod'

const userSignUpSchema = z.object({
    email: z.string().email(),
    firstName: z.string().max(50),
    surname: z.string().max(50),
})

type UserSignUpDTO = z.infer<typeof userSignUpSchema>

function getAuthRoutes() {
    const router = express.Router()

    router.post('/signup', signUp)

    return router
}

function signUp(req: Request, res: Response) {
    try {
        const userSignUpDTO: UserSignUpDTO = req.body
        userSignUpSchema.parse(userSignUpDTO)
        res.send(true)
    } catch (err) {
        res.send(err)
    }
}

export { getAuthRoutes }
