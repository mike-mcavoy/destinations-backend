import express from 'express'
import { Server } from 'net'
import { contextMiddleware } from './middleware/context'
import { getRoutes } from './routes'

async function startServer(port: number): Promise<Server> {
    const app = express()

    app.use(express.json())

    app.use(contextMiddleware)

    app.use('/api', getRoutes())

    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            console.log(`Starting server, listening on port ${port}`)
        })

        resolve(server)
    })
}

export { startServer }
