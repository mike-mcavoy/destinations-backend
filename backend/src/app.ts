import express from 'express'
import { Server } from 'net'
import { contextMiddleware } from './middleware/context'
import { errorMiddleware } from './middleware/error'
import { notFoundMiddleware } from './middleware/notFound'
import { responseMiddleware } from './middleware/response'
import { getRoutes } from './routes'

async function startServer(port: number): Promise<Server> {
    const app = express()

    app.use(express.json())

    app.use(contextMiddleware)

    app.use('/api', getRoutes())

    app.use(responseMiddleware)

    app.use(notFoundMiddleware)

    app.use(errorMiddleware)

    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            console.log(`Starting server, listening on port ${port}`)
        })

        resolve(server)
    })
}

export { startServer }
