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
  return (
    <div className={scss.container}>
      <MultiPlayerBoardComponent/>
    </div>
  )
}

export default MultiPlayerBoard