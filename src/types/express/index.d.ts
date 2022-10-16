declare namespace Express {
    interface Context {
        user?: {
            id: string
        }
    }

    export interface Request {
        context: Context
    }
}
