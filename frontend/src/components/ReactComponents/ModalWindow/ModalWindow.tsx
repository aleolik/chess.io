import React,{FC, useEffect} from 'react'
import { useAppDispatch } from '../../../redux/hooks/useAppDispatch'
import {useAppSelector} from '../../../redux/hooks/useAppSelector'
import scss from './ModalWindow.module.scss'
import { modalSlice } from '../../../redux/reducers/modalReducer'
import { Colors } from '../../../chess-logic/models/Colors'
import {AiOutlineClose} from 'react-icons/ai'
import whiteWonImg from '../../../assets/media/whiteWon.png'
import blackWonImg from '../../../assets/media/blackWon.png'
import tieImg from '../../../assets/media/chessTie.png'

interface ModalWndowProps{
    children : any
}


interface GameStatusWindowProps{
  isWinner : Colors | null
}
export const GameStatusWindow : FC<GameStatusWindowProps> = ({isWinner}) => {
  const gameData = useAppSelector(state => state.webSocket.gameData)
  return (
      <div className={scss.gameStatusContainer}>
          {isWinner ? (
            <div>{isWinner.charAt(0).toUpperCase()+isWinner.slice(1)} player won by {gameData?.clientTimer?.time === 0 || gameData?.enemyClientTimer?.time === 0 ? "time" : "mate"}!</div>
          )
          : (<div>It's a tie!</div>)}
          <img className={scss.wonImage} src={isWinner ? isWinner === Colors.BLACK ? blackWonImg : whiteWonImg : tieImg} alt='wonIcon'/>
      </div>
  )
}

const ModalWindow : FC<ModalWndowProps> = ({children}) => {
  const rootClasses = [scss.modal]
  const showModal = useAppSelector(state => state.modal.showModal)
  const dispatch = useAppDispatch()
  const {closeModalWindow} = modalSlice.actions

  if (showModal){
    rootClasses.push(scss.active)
  }

  const onClick = () => {
      dispatch(closeModalWindow())
  }

  return (
      <div className={rootClasses.join(' ')}>
        <div className={scss.modal_content} onClick={(e : React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
          <AiOutlineClose className={scss.closeIcon} onClick={onClick}/>
          {children}
        </div>
      </div>
  )
}

export default ModalWindow