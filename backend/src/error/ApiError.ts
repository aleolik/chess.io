interface IApiError {
    status : number;
    message : string;
}


class ApiError implements IApiError{
    status: number;
    message: string;
    constructor(status : number,message : string){
        this.status = status
        this.message = message
    }

    static Unauthorized(message : string) : ApiError{
       return new ApiError(401,message)
    }
    static badRequest(message : string) : ApiError{
        return new  ApiError(400,message)
    }
    static NotFound(message:string) : ApiError{
        return new ApiError(404,message)
    }
    static internal(message : string) : ApiError{
        return new  ApiError(500,message)
    }
    static forbidden(message : string) : ApiError{
        return new  ApiError(403,message)
    }
}

export default ApiError