import React, { useEffect, useState } from 'react'
import SideBar from '../../components/ReactComponents/SideBar/SideBar'
import { Board } from '../../models/Board'
import BoardComponent from '../../components/ChessComponents/BoardComponent/BoardComponent'
import { isDesktop, isMobile, isTablet } from 'react-device-detect'
import scss from './MainPage.module.scss'
import BottomMenu from '../../components/ReactComponents/BottomMenu/BottomMenu'
import backgroundImg from '../../assets/background.png'
import { Navigate, useNavigate } from 'react-router-dom'
const MainPage = () => {
  const navigate = useNavigate()
  return (
    <div>
        <div>
            {!isMobile && (
                <div className={scss.container}>
                    <div className={scss.firstContainer}>
                        <img src={backgroundImg} alt='bg' className={scss.bgImg}></img>
                        <button onClick={() => navigate('/single-player')} className={[`btn btn-primary`,scss.buttonPlay].join(' ')}>Play on 1 device</button>
                        <button className={[`btn btn-primary`,scss.buttonPlay].join(' ')}>Play Multiplayer</button>
                    </div>
                </div>
            )}
            <BottomMenu/>
        </div>
    </div>
  )
}

export default MainPage