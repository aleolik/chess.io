import {FC, useEffect} from 'react'
import { useAppDispatch } from '../../../redux/hooks/useAppDispatch'
import {useAppSelector} from '../../../redux/hooks/useAppSelector'
import {FiLogIn} from 'react-icons/fi'
import {AiOutlineArrowDown} from 'react-icons/ai'
import {CiLogin} from 'react-icons/ci'
import scss from './FormNavigationButtons.module.scss'
import { modalSlice } from '../../../redux/reducers/modalReducer'
import { userSlice } from '../../../redux/reducers/userReducer'

const FormNavigationButtons  = () => {
  const dispatch = useAppDispatch()
  const {showModalLogin,showModalRegister} = modalSlice.actions
  const refreshUserOnError = userSlice.actions.refreshUserOnError
  const userOnError = useAppSelector(state => state.user.userOnError)

  const showLoginAction = () => {
    dispatch(showModalLogin())
  }

  const showRegisterAcrion = () => {
    dispatch(showModalRegister())
  }

 useEffect(() => {
  if (userOnError){
    setTimeout(() => {
      dispatch(refreshUserOnError())
    },5000);
  }
 },[userOnError])
  
  return (
    <div>
        <div  className={scss.form_btn_container}>
          <div onClick={showLoginAction} className={scss.box} >
            <div className={scss.formButton}>
              <span>Sign In<CiLogin  size={20} style={{'marginLeft':10}}/></span>
            </div>
          </div>
          <div  onClick={showRegisterAcrion}  className={scss.box}>
            <div className={scss.formButton}>
              <span>Sign Up<AiOutlineArrowDown  size={20} style={{'marginLeft':10}}/></span>
            </div>
          </div>
        </div>
        <hr></hr>
    </div>
  )
}

export default FormNavigationButtons