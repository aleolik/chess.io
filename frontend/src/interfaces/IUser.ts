export interface IUser {
    id : string,
    username : string,
    email : string,
}

export interface userState {
    user : IUser | null,
    userOnError : string,
    userOnLoad : boolean,
}

