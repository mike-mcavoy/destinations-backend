import express, { Request, Response } from 'express'
import crypto from 'crypto'
import {
    AuthFlowType,
    CognitoIdentityProvider,
} from '@aws-sdk/client-cognito-identity-provider'
import z from 'zod'

const REGION = ''
const CLIENT_ID = ''
const CLIENT_SECRET = ''
const USER_POOL_ID = ''

const cognitoIdentity = new CognitoIdentityProvider({
    region: REGION,
    credentials: { accessKeyId: CLIENT_ID, secretAccessKey: CLIENT_SECRET },
})

const userSignUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().max(50),
    surname: z.string().max(50),
})

type UserSignUpDTO = z.infer<typeof userSignUpSchema>

const userSignInSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

type UserSignInDTO = z.infer<typeof userSignInSchema>

function getAuthRoutes() {
    const router = express.Router()

    router.post('/signup', signUp)
    router.post('/signin', signIn)

    return router
}

async function signUp(req: Request, res: Response) {
    try {
        const userSignUpDTO: UserSignUpDTO = req.body
        userSignUpSchema.parse(userSignUpDTO)

        const userData = await cognitoIdentity.signUp({
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

        const confirmedUserData = await cognitoIdentity.adminConfirmSignUp({
            UserPoolId: USER_POOL_ID,
            Username: userSignUpDTO.email,
        })

        console.log(confirmedUserData)

        res.status(200).send(true)
    } catch (err) {
        res.send(err)
    }
}

async function signIn(req: Request, res: Response) {
    try {
        const userSignInDTO: UserSignInDTO = req.body
        userSignInSchema.parse(userSignInDTO)

        const data = await cognitoIdentity.initiateAuth({
            AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            ClientId: CLIENT_ID,
            AuthParameters: {
                USERNAME: userSignInDTO.email,
                PASSWORD: userSignInDTO.password,
                SECRET_HASH: generateHash(userSignInDTO.email),
            },
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
