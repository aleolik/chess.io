import {FC, useEffect, useState} from 'react'

export enum AlertTypes {
  Error = "Error",
  Info = "Info",
}

interface ICustomAlert{
  message : string
  type : AlertTypes
}
const CustomAlert : FC<ICustomAlert> = ({message,type}) => {

  const [classNames,setClassNames] = useState<string[]>(['alert'])
  
  useEffect(() => {
    if (type === AlertTypes.Error){
      setClassNames(prev => ([...prev,'alert-danger']))
    }
    if (type === AlertTypes.Info){
      setClassNames(prev => ([...prev,'alert-info']))
    }
  },[type])

  return (
    <div className={classNames.join(' ')}>{message}</div>
  )
}

export default CustomAlert