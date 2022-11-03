import express from 'express'
import { getAuthRoutes } from './auth'
import { getHealthCheckRoutes } from './health'

function getRoutes() {
    const router = express.Router()

    router.use('/healthcheck', getHealthCheckRoutes())
    router.use('/auth', getAuthRoutes())

    return router
}

export { getRoutes }
