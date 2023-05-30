import React,{FC, useEffect} from 'react'
import { useAppDispatch } from '../../../redux/hooks/useAppDispatch'
import {useAppSelector} from '../../../redux/hooks/useAppSelector'
import scss from './ModalWindow.module.scss'
import { modalSlice } from '../../../redux/reducers/modalReducer'
import FormNavigationButtons from '../FormNavigationButtons/FormNavigationButtons'

interface ModalWndowProps{
    children : any
}

const ModalWindow : FC<ModalWndowProps> = ({children}) => {
  const rootClasses = [scss.modal]
  const showModal = useAppSelector(state => state.modal.showModal)
  const dispatch = useAppDispatch()
  const {closeModalWindow,showModalLogin,showModalRegister} = modalSlice.actions

  if (showModal){
    rootClasses.push(scss.active)
  }

  const onClick = () => {
      dispatch(closeModalWindow())
  }

  return (
      <div className={rootClasses.join(' ')} onClick={onClick}>
        <div className={scss.modal_content} onClick={(e : React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
          <FormNavigationButtons/>
          {children}
        </div>
      </div>
  )
}

export default ModalWindow