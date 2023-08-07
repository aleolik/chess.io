import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import scss from './RegisterForm.module.scss'
import {getRandomCorrectPassword } from '../../../utils/asyncUtils/generateRandomPassword'
import {errorInEmail} from '../../../utils/data-checkers-light/check-email-light'
import {errorInPassword} from '../../../utils/data-checkers-light/check-password-light'
import {errorInUsername} from '../../../utils/data-checkers-light/check-username-light'
import CustomAlert, { AlertTypes } from '../CustomAlert/CustomAlert'
import { useAppDispatch } from '../../../redux/hooks/useAppDispatch'
import { useAppSelector } from '../../../redux/hooks/useAppSelector'
import { RegisterUserAction } from '../../../redux/AsyncActions/Register'
import { AiFillEyeInvisible,AiFillEye} from 'react-icons/ai'
import { closeModalWindowAsync } from '../../../redux/AsyncActions/CloseModalWindowAsync'
import FormNavigationButtons from '../FormNavigationButtons/FormNavigationButtons'
import { userSlice } from '../../../redux/reducers/userReducer'
import Loader from '../Loader/Loader'
import { Axios, AxiosError } from 'axios'

const RegisterForm = () => {

  const dispatch = useAppDispatch()
  const {userOnError,userOnLoad} = useAppSelector(state => state.user)
  const errorLoad = userSlice.actions.errorLoad

  const [email,setEmail] = useState<string>('')
  const [password,setPassword] = useState<string>('')
  const [username,setUsername] = useState<string>('')

  const [emailError,setEmailError] = useState<string>('')
  const [usernameError,setUsernameError] = useState<string>('')
  const [passwordError,setPasswordError] = useState<string>('')

  const passwordInputRef = useRef<HTMLInputElement | null>(null)
  const buttonPasswordRef = useRef<HTMLButtonElement | null>(null)
  const [canGenerateRandomPassword,setCanGenerateRandomPassword] = useState<boolean>(true)
  const [showPassword,setShowPassword] = useState<boolean>(false)
  const [isAsyncLoading,setAsyncLoading] = useState<boolean>(false)
  const passwordRepeatedInputRef = useRef<HTMLInputElement | null>(null)


  const showPasswordAction = () => {
    if (passwordInputRef.current){
      if (showPassword){
        passwordInputRef.current.type = 'password'
        setShowPassword(false)
      } else {
        setShowPassword(true)
        passwordInputRef.current.type = 'text'
      }
    }
  }
  
  // onChange triggers
  const usernameOnChange = (event : ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
    if (event.target.value) {
      const isErrorInUsername = errorInUsername(event.target.value)
      if (isErrorInUsername){
        setUsernameError(isErrorInUsername)
      } else {
        if (usernameError) {
          setUsernameError('')
        }
      }
    }
  }

  const emailOnChange = (event : ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
    if (event.target.value) {
      const isEmailError = errorInEmail(event.target.value)
      if (isEmailError){
        setEmailError(isEmailError)
      } else {
        if (emailError) {
          setEmailError('')
        }
      }
    }
  }

  const repeatedPasswordOnChange = (event : ChangeEvent<HTMLInputElement>) => {
    const msg = "Passwords should be matched"
    if (event.target.value !== password){
      setPasswordError(msg)
    } else {
      if (passwordError && passwordError === msg) {
        setPasswordError("")
      }
    }
  }


  const passwordOnChange = (event : ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
    if (event.target.value) {
      const isErrorInPassword = errorInPassword(event.target.value)
      if (isErrorInPassword){
        setPasswordError(isErrorInPassword)
      } else {
        if (passwordError) {
          setPasswordError('')
        }
      }
    }
  }

    
    


  const generateRandomPassword = async() => {
    try {
      setAsyncLoading(true)
      const generatedPassword = await getRandomCorrectPassword()
      if (generatedPassword instanceof AxiosError) {
        dispatch(errorLoad(`status : ${generatedPassword.status?.toString() ? generatedPassword.status.toString() : "500"},errMessage : ${generatedPassword.message}`))
      } 
      if (passwordInputRef.current && passwordRepeatedInputRef.current && typeof generatedPassword === 'string' && generatedPassword.length) {
        // set value in inputs
        passwordInputRef.current.value = generatedPassword
        passwordRepeatedInputRef.current.value = generatedPassword
        // set state
        setPassword(generatedPassword)
        setCanGenerateRandomPassword(false)
        if (passwordError) {
          setPasswordError("")
        }
        setTimeout(() => {
            setCanGenerateRandomPassword(true)
        },10000);
        if (!showPassword){
          showPasswordAction()
        }
      }
    } catch (e) {
      const err = e as AxiosError
      dispatch(errorLoad(`status : ${err.status?.toString() ? err.status.toString() : "500"},errMessage : ${err.message}`))
    } finally {
      setTimeout(() => {
        setAsyncLoading(false) 
      },450);
    }
  }

  const CreateNewUser = async(event : FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const emailErr = errorInEmail(email)
        const passwordErr = errorInPassword(password)
        const usernameErr = errorInUsername(username)

        if (emailErr || passwordErr || usernameErr) {
            if (emailErr){
              setEmailError(emailErr)
            } else {
              setEmailError('')
            }
            if (usernameErr){
              setUsernameError(usernameErr)
            } else {
              setUsernameError('')
            }
            if (passwordErr){
              setPasswordError(passwordErr)
            } else {
              setPasswordError('')
            }

            return;
        }
        await dispatch(RegisterUserAction(username,email,password))
        await dispatch(closeModalWindowAsync())
  }

  return (
    <>
      <FormNavigationButtons/>
      {isAsyncLoading && (
        <Loader/>
      )}
      <form onSubmit={CreateNewUser} className={scss.form}>
        {userOnLoad && (
          <Loader/>
        )}
        {userOnError && (
          <CustomAlert type={AlertTypes.Error} message={userOnError}/>
         )}
        {usernameError && (
          <CustomAlert type={AlertTypes.Error} message={usernameError}/>
        )}
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-default">Username</span>
          </div>
          <input onChange={usernameOnChange}  type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
        </div>
        {emailError && (
          <CustomAlert type={AlertTypes.Error} message={emailError}/>
        )}
        <div className="input-group mb-3">
          <input onChange={emailOnChange} type="text" className="form-control" placeholder="Email Adress" aria-label="Default" aria-describedby="basic-addon2"/>
        </div>
        {passwordError && (
          <CustomAlert type={AlertTypes.Error} message={passwordError}/>
        )}
        <div className={[scss.passwordGroup,"input-group mb-3"].join(' ')}>
        <input placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"  ref={passwordInputRef}  onChange={passwordOnChange} type="password" className="form-control" aria-label="" aria-describedby="basic-addon1"/>
          <div className="input-group-append">
              <span className="input-group-text" id="basic-addon2" onClick={showPasswordAction}>{showPassword ? <AiFillEye/> : <AiFillEyeInvisible/>}</span>
            </div>
          <div className={'input-group-prepend mt-md-0'}>
             <button disabled={canGenerateRandomPassword ? false : true} ref={buttonPasswordRef} onClick={generateRandomPassword} className="btn btn-outline-primary w-100" type="button">Generate Random Password</button>
          </div>
        </div>
        <div className="input-group mb-3">
          <input placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;" onChange={repeatedPasswordOnChange}  ref={passwordRepeatedInputRef} type="password" className="form-control"  aria-label="" aria-describedby="basic-addon1"/>
        </div>
        <button className={scss.btnRegister}>Create User</button>
      </form>
    </>
  )
}

export default RegisterForm