import React, { ChangeEvent, useState } from 'react'
import scss from './LoginForm.module.scss'
import { useAppDispatch } from '../../../redux/hooks/useAppDispatch'
import { LoginUserAction } from '../../../redux/AsyncActions/Login'
import CustomAlert, { AlertTypes } from '../CustomAlert/CustomAlert'
import { useAppSelector } from '../../../redux/hooks/useAppSelector'
import { closeModalWindowAsync } from '../../../redux/AsyncActions/CloseModalWindowAsync'
import FormNavigationButtons from '../FormNavigationButtons/FormNavigationButtons'
import Loader from '../Loader/Loader'
const LoginForm = () => {
    const dispatch = useAppDispatch()
    const [email,setEmail] = useState<string>('')
    const [password,setPassword] = useState<string>('')
    const {userOnError,userOnLoad} = useAppSelector(state => state.user)

    const [passwordError,setPasswordError] = useState<string>('')
    const [emailError,setEmailError] = useState<string>('')
  
    const emailHandler = (e : ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value)
    }
  
    const passwordHandler = (e : ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
    }

    const LoginUser = async(e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!email && !password){
        if (!password.length){
          setPasswordError('Password field can not be empty')
        }
        if (!email.length){
          setEmailError('Email field can not be empty')
        }
        return;
      }

      setEmailError('')
      setPasswordError('')

      await dispatch(LoginUserAction(email,password))
      await dispatch(closeModalWindowAsync())
    }
  
    return (
      <>
        <FormNavigationButtons/>
        {userOnLoad && (
          <Loader/>
        )}
        <form onSubmit={LoginUser} className={scss.form}>
        {userOnError && (
          <CustomAlert type={AlertTypes.Error} message={userOnError}/>
         )}
        {emailError && (
          <CustomAlert type={AlertTypes.Error} message={emailError}/>
         )}
        <div className="input-group mb-3">
          <input onChange={emailHandler} type="text" className="form-control" placeholder="Email Adress" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
        </div>
        {passwordError && (
          <CustomAlert type={AlertTypes.Error} message={passwordError}/>
         )}
        <div className="input-group mb-3">
          <input placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;" onChange={passwordHandler} type="password" className="form-control" aria-label="" aria-describedby="basic-addon1"/>
        </div>
        <button className={scss.btnLogin}>Login</button>
        </form>
      </> 
    )
}
export default LoginForm