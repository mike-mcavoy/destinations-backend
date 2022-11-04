interface ResponseObject {
    message: string
    status: number
    body?: any
}

class ApiResponse {
    body: any
    status: number

    private OK = 'Ok'

    constructor(data: any, status = 200) {
        this.body = data
        this.status = status
    }

    getResponseObject(): ResponseObject {
        return {
            status: this.status,
            message: this.OK,
            body: this.body,
        }
    }
}

export { ResponseObject, ApiResponse }
