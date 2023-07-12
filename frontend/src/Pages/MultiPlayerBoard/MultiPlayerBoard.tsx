import React,{FC, useEffect, useState}from 'react'
import scss from './MultiPlayerBoard.module.scss'
import { Board } from '../../chess-logic/models/Board'
import MultiPlayerBoardComponent from '../../components/ChessComponents/MultiPlayerBoardComponent/MultiPlayerBoardComponent'
import userInstance from '../../axios/userInstance'
import { useLocation } from 'react-router-dom'
import { Colors } from '../../chess-logic/models/Colors'
import { useAppSelector } from '../../redux/hooks/useAppSelector'
import { IUser } from '../../interfaces/IUser'
import { boardSlice } from '../../redux/reducers/boardRedurcer'
import { useAppDispatch } from '../../redux/hooks/useAppDispatch'

const MultiPlayerBoard  = () => {
  const board = useAppSelector(state => state.board.board)
  const {initNewBoard,updateBoard} = boardSlice.actions
  const dispatch = useAppDispatch()
  const location = useLocation()

  const {enemyUser,lobbyId} = location.state as {enemyUser : {user:IUser,color:Colors},lobbyId:string}
  const {ws,user,color} = useAppSelector(state => state.webSocket)
  useEffect(() => {
    if (user && color && ws) {
      dispatch(initNewBoard(color === Colors.BLACK ? true : false))
    }
  },[])
  return (
    <div className={scss.container}>
      {color === Colors.BLACK ? user?.username : enemyUser.user.username}
      {board && user && color &&  (
        <MultiPlayerBoardComponent
        user={{
          user : user,
          color : color
        }}
        lobbyId={lobbyId} enemyUser={{
          user : enemyUser.user,
          color : enemyUser.color,
        }}
      />
      )}
      {enemyUser.color === Colors.WHITE ? enemyUser.user.username : user?.username}
    </div>
  )
}

export default MultiPlayerBoard