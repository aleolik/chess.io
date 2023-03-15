import React from "react"

export class UiError extends React.Component{
    status : number
    message : string

    constructor(props : {
        status : number,
        message : string,
    }){
        super(props)
        this.status = props.status
        this.message = props.message
    }
}


export default UiError

