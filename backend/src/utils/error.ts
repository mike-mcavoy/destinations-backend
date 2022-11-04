import { ResponseObject } from './response'

class ApiError extends Error {
    constructor(message: string) {
        super()
        this.message = message
    }

    getStatusCode() {
        switch (true) {
            case this instanceof BadRequest:
                return 400

            case this instanceof NotFound:
                return 404

            case this instanceof NotAuthorized:
                return 403

            case this instanceof NotAuthenticated:
                return 401

            case this instanceof InternalServerError:
                return 500

            default:
                return 500
        }
    }

    getResponseObject(): ResponseObject {
        return {
            status: this.getStatusCode(),
            message: this.message,
        }
    }
}

class BadRequest extends ApiError {}
class NotFound extends ApiError {}
class NotAuthorized extends ApiError {}
class NotAuthenticated extends ApiError {}
class InternalServerError extends ApiError {}

export {
    ApiError,
    BadRequest,
    NotFound,
    NotAuthorized,
    NotAuthenticated,
    InternalServerError,
}
