import { ResponseObject } from '../../utils/response'

declare namespace Express {
    interface Context {
        user?: {
            id: string
        }
    }

    export interface Response {
        locals: {
            context: Context
            response: ResponseObject
        }
    }
}
