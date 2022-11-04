import express, { NextFunction, Request, Response } from 'express'
import crypto from 'crypto'
import {
    AuthFlowType,
    CognitoIdentityProvider,
} from '@aws-sdk/client-cognito-identity-provider'
import z from 'zod'
import { DB } from '../db'
import { InternalServerError } from '../utils/error'
import { ApiResponse } from '../utils/response'

const REGION = process.env.COGNITO_REGION as string
const CLIENT_ID = process.env.COGNITO_CLIENT_ID as string
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET as string

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

const refreshTokenSchema = z.object({
    refreshToken: z.string(),
    userId: z.string(),
})

type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>

function getAuthRoutes() {
    const router = express.Router()

    router.post('/signup', signUp)
    router.post('/signin', signIn)
    router.post('/refresh', refreshToken)

    return router
}

async function signUp(req: Request, res: Response, next: NextFunction) {
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

        if (!data.UserSub) {
            throw new InternalServerError(
                'Something went wrong creating a new account'
            )
        }

        const dbUser = await DB.user.create({
            data: {
                id: data.UserSub!,
                firstName: userSignUpDTO.firstName,
                surname: userSignUpDTO.surname,
                email: userSignUpDTO.email,
            },
        })

        res.locals.response = new ApiResponse({
            id: dbUser.id,
            email: dbUser.email,
        })

        next()
    } catch (err) {
        next(err)
    }
}

async function signIn(req: Request, res: Response, next: NextFunction) {
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

        res.locals.response = new ApiResponse({
            accessToken: data.AuthenticationResult?.AccessToken,
        })

        next()
    } catch (err) {
        next(err)
    }
}

async function refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshTokenDto: RefreshTokenDTO = req.body
        refreshTokenSchema.parse(refreshTokenDto)

        const { userId, refreshToken } = refreshTokenDto
        const data = await cognitoIdentity.initiateAuth({
            AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
            ClientId: CLIENT_ID,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken,
                SECRET_HASH: generateHash(userId),
            },
        })

        res.locals.response = new ApiResponse({
            accessToken: data.AuthenticationResult?.AccessToken,
        })

        next()
    } catch (err) {
        next(err)
    }
}

function generateHash(username: string): string {
    return crypto
        .createHmac('SHA256', CLIENT_SECRET)
        .update(username + CLIENT_ID)
        .digest('base64')
}

export { getAuthRoutes }
