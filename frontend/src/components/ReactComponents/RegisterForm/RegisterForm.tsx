import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import scss from './RegisterForm.module.scss'
import { checkEmail, checkPassword, checkUsername, getRandomCorrectPassword } from '../../../utils/FormFunctions'
import CustomAlert, { AlertTypes } from '../CustomAlert/CustomAlert'
import { useAppDispatch } from '../../../redux/hooks/useAppDispatch'
import { useAppSelector } from '../../../redux/hooks/useAppSelector'
import { RegisterUserAction } from '../../../redux/AsyncActions/Register'
import { modalSlice } from '../../../redux/reducers/modalReducer'
import { store } from '../../..'
import { AiFillEyeInvisible,AiFillEye} from 'react-icons/ai'

const RegisterForm = () => {

  const dispatch = useAppDispatch()
  const {load,user,error} = useAppSelector(state => state.user)
  const {closeModalWindow} = modalSlice.actions

  const [email,setEmail] = useState<string>('')
  const [password,setPassword] = useState<string>('')
  const [username,setUsername] = useState<string>('')

  const [emailError,setEmailError] = useState<string>('')
  const [usernameError,setUsernameError] = useState<string>('')
  const [passwordError,setPasswordError] = useState<string>('')

  const passwordInputRef = useRef<HTMLInputElement | null>(null)
  const buttonPasswordRef = useRef<HTMLButtonElement | null>(null)
  const [timeInterval,setTimeInterval] = useState<ReturnType<typeof setInterval> | null>(null)
  const [generatedRandomPassword,setGeneratedRandomPassword] = useState<boolean>(false)
  const [showPassword,setShowPassword] = useState<boolean>(false)
  const [intervalValue,setIntervalValue] = useState<number>(0)
  const passwordRepeatedInputRef = useRef<HTMLInputElement | null>(null)

  const addSecondToInterval = () => {
    setIntervalValue(prev => (prev+1))
  }

  useEffect(() => {
    if (intervalValue >= 10){

      if (timeInterval){
        clearInterval(timeInterval)
      }

      setTimeInterval(null)

      setIntervalValue(0)
    }

  },[intervalValue])

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

  const generateRandomPassword = async() => {
    const generatedPassword = await getRandomCorrectPassword()
    if (generatedPassword){
      if (passwordInputRef.current && passwordRepeatedInputRef.current){
        // set value in inputs
        passwordInputRef.current.value = generatedPassword
        passwordRepeatedInputRef.current.value = generatedPassword
        // set state
        setPassword(generatedPassword)

        setTimeInterval(setInterval(addSecondToInterval,1000))
        setGeneratedRandomPassword(true)
        showPasswordAction()
      }
    }
    else {
      // TODO : error message with toastify
    }
  }

  const CreateNewUser = async(event : FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const errorInEmail = checkEmail(email)
        const errorInPassword = checkPassword(password)
        const errorInUsername = checkUsername(username)

        if (errorInEmail || errorInPassword || errorInUsername) {
            if (errorInEmail){
              setEmailError(errorInEmail)
            } else {
              setEmailError('')
            }
            if (errorInUsername){
              setUsernameError(errorInUsername)
            } else {
              setUsernameError('')
            }
            if (errorInPassword){
              setPasswordError(errorInPassword)
            } else {
              setPasswordError('')
            }

            return;
        }

        const isError : string | undefined = await dispatch(RegisterUserAction(username,email,password))

        if (!isError){
          dispatch(closeModalWindow())
        }

  }

  const emailHandler = (e : ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const passwordHandler = (e : ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const usernameHandler = (e : ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  return (
    <form onSubmit={CreateNewUser} className={scss.form}>
        {error && (
          <CustomAlert type={AlertTypes.Error} message={error}/>
         )}
        {usernameError && (
          <CustomAlert type={AlertTypes.Error} message={usernameError}/>
        )}
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-default">Username</span>
          </div>
          <input onChange={usernameHandler}  type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
        </div>
        {emailError && (
          <CustomAlert type={AlertTypes.Error} message={emailError}/>
        )}
        <div className="input-group mb-3">
          <input onChange={emailHandler} type="text" className="form-control" placeholder="Email Adress" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
          <div className="input-group-append">
            <span className="input-group-text" id="basic-addon2">@gmail.com</span>
          </div> 
      
        </div>
        {passwordError && (
          <CustomAlert type={AlertTypes.Error} message={passwordError}/>
        )}
        <div className="input-group mb-3">
        <input placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"  ref={passwordInputRef}  onChange={passwordHandler} type="password" className="form-control" aria-label="" aria-describedby="basic-addon1"/>
          <div className='input-group-prepend'>
             <button disabled={timeInterval !== null ? true : false} ref={buttonPasswordRef} onClick={generateRandomPassword} className="btn btn-outline-primary" type="button">Generate Random Password</button>
          </div>
          <div className="input-group-append">
            <span className="input-group-text" id="basic-addon2" onClick={showPasswordAction}>{showPassword ? <AiFillEyeInvisible/> : <AiFillEye/>}</span>
          </div>
        </div>
        <div className="input-group mb-3">
          <input placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"  ref={passwordRepeatedInputRef} type="password" className="form-control"  aria-label="" aria-describedby="basic-addon1"/>
        </div>
        <button className={scss.btnRegister}>Create User</button>
    </form>
  )
}

export default RegisterForm