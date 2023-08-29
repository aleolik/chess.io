import React,{FC, useEffect, useRef, useState}from 'react'
import scss from './MultiPlayerBoard.module.scss'
import MultiPlayerBoardComponent from '../../components/ChessComponents/MultiPlayerBoardComponent/MultiPlayerBoardComponent'
import { useAppSelector } from '../../redux/hooks/useAppSelector'
import { useNavigate } from 'react-router-dom'


const MultiPlayerBoard  = () => {
  const navigate = useNavigate()
  const {gameData,ws} = useAppSelector(state => state.webSocket)
  return (
    <div className={scss.container}>
      {ws && gameData ? (
        <MultiPlayerBoardComponent/>
      )
      : (
        <div className={scss.containerText}>
          {ws ? (
            <div className={scss.text} style={{'color':'white','fontSize':'2rem','flexWrap':'wrap','letterSpacing':'0.1rem'}}>Game with this id does not exist anymore!</div>
          )  : (
            <div className={scss.text} style={{'color':'white','fontSize':'2rem','flexWrap':'wrap','letterSpacing':'0.1rem'}}>Connection to webSocket is lost...</div>
          )}
          <button onClick={() => navigate('/')} className={scss.btn}>Go Home</button>
        </div>
      )}
    </div>
  )
}

export default MultiPlayerBoard