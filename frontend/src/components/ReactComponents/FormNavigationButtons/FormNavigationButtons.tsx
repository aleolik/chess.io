import { useAppDispatch } from '../../../redux/hooks/useAppDispatch'
import {AiOutlineArrowDown} from 'react-icons/ai'
import {CiLogin} from 'react-icons/ci'
import scss from './FormNavigationButtons.module.scss'
import { modalSlice } from '../../../redux/reducers/modalReducer'

const FormNavigationButtons  = () => {
  const dispatch = useAppDispatch()
  const {showModalLogin,showModalRegister} = modalSlice.actions

  const showLoginAction = () => {
    dispatch(showModalLogin())
  }

  const showRegisterAcrion = () => {
    dispatch(showModalRegister())
  }

  
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