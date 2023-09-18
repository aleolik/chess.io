import { AVAILABLE_ROLES } from "./models/User";
import { Request } from "express";

export interface IUser{
    email : string;
    id : string;
    username : string;
    roles? : Array<AVAILABLE_ROLES>
}

// whenever you call async function in ANY of controllers,it returns an instance of ICustomResponse
export interface ICustomResponse {
    status : number,
    message? : string,
    data? : any,
}   


export interface IUserFromClient{
    id : number,
    username : string,
    email : string,
}
export interface IRequestWithUser extends Request{
    user : IUserFromClient | undefined
}

