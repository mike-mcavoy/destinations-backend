import express, { Request, Response } from 'express'
import crypto from 'crypto'
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider'
import z from 'zod'

const REGION = ''
const CLIENT_ID = ''
const CLIENT_SECRET = ''

const cognitoIdentity = new CognitoIdentityProvider({ region: REGION })

const userSignUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().max(50),
    surname: z.string().max(50),
})

type UserSignUpDTO = z.infer<typeof userSignUpSchema>

function getAuthRoutes() {
    const router = express.Router()

    router.post('/signup', signUp)

    return router
}

async function signUp(req: Request, res: Response) {
    try {
        const userSignUpDTO: UserSignUpDTO = req.body
        userSignUpSchema.parse(userSignUpDTO)

        const data = await cognitoIdentity.signUp({
            ClientId: CLIENT_ID,
            SecretHash: generateHash(userSignUpDTO.email),
            Username: userSignUpDTO.email,
            Password: userSignUpDTO.password,
            UserAttributes: [
                { Name: 'email', Value: userSignUpDTO.email },
                { Name: 'given_name', Value: userSignUpDTO.firstName },
                { Name: 'family_name', Value: userSignUpDTO.surname },
            ],
        })

        console.log(data)

        res.status(200).send(true)
    } catch (err) {
        res.send(err)
    }
}

function generateHash(username: string): string {
    return crypto
        .createHmac('SHA256', CLIENT_SECRET)
        .update(username + CLIENT_ID)
        .digest('base64')
}

export { getAuthRoutes }
