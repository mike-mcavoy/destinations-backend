import axios from 'axios'
import jwtToPem from 'jwk-to-pem'

const REGION = process.env.COGNITO_REGION as string
const POOL_ID = process.env.COGNITO_POOL_ID as string
const COGNITO_JWT_URL = `https://cognito-idp.${REGION}.amazonaws.com/${POOL_ID}/.well-known/jwks.json`

const pems: { [key: string]: any } = {}

async function generatePems() {
    try {
        const res = await axios.get(COGNITO_JWT_URL)

        if (res.status !== 200) {
            throw 'There was an error with the request'
        }

        const { keys } = res.data as { keys: { [key: string]: any } }

        for (const [_, key] of Object.entries(keys)) {
            const jwk = {
                alg: key.alg,
                e: key.e,
                kid: key.kid,
                kty: key.kty,
                n: key.n,
                use: key.use,
            }

            const pem = jwtToPem(jwk)

            pems[key.kid] = pem
        }

        Object.freeze(pems)
    } catch (err) {
        console.log('Could not fetch jwks')
    }
}

export { generatePems, pems }
