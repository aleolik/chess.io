import React, { useState } from 'react'
import scss from './SideBar.module.scss'
import { useAppDispatch } from '../../../redux/hooks/useAppDispatch'
import { useAppSelector } from '../../../redux/hooks/useAppSelector'
import { AvailableWindows, modalSlice } from '../../../redux/reducers/modalReducer'
import ModalWindow from '../ModalWindow/ModalWindow'
import RegisterForm from '../RegisterForm/RegisterForm'
import LoginForm from '../LoginForm/LoginForm'
import defaultUserIcon from '../../../assets/media/defaultUserIcon.png'
import { useLogout } from '../../../hooks/useLogout'
import { NavLink, useNavigate } from 'react-router-dom'
import chessLogo from '../../../assets/media/chessLogo.png'
import { isMobile } from 'react-device-detect'
import chessIoLogo from '../../../assets/media/chessio-logo.png'

interface ICustomLink{
    text : string,
    to : string,

}

const navigationLinks : ICustomLink[] = [
    {
        text : "ChessIo",
        to : "/"
    },
    {
        text : "history",
        to : "/history"
    },
    {
        text : "Puzzles",
        to : "/Puzzles"
    },
    {
        text : "Learn",
        to : "/Learn"
    },
    {
        text : "News",
        to : "/News"
    },
    {
        text : "...More",
        to : "/More"
    },
]

const SideBar = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const doLogout = useLogout()

    const userLogout = (e : React.MouseEvent<HTMLButtonElement>) => {
        doLogout()
    }

    const {showModalRegister,showModalLogin} = modalSlice.actions
    const {showModal,showWindow} = useAppSelector(state => state.modal)
 
   const openRegisterWindow = () => {
        dispatch(showModalRegister())
   }

   const openLoginWindow = () => {
    dispatch(showModalLogin())
    }   

   const {load,error,user} = useAppSelector(state => state.user)

  return (
    <div className={scss.sidebar}>
        <img onClick={() => navigate('/')} src={chessIoLogo} alt='logo' className={scss.chessIoLogo}></img>
        {showModal && showWindow === AvailableWindows.Register && (
            <ModalWindow children={<RegisterForm/>}/>
        )}
        {showModal && showWindow === AvailableWindows.Login && (
            <ModalWindow children={<LoginForm/>}/>
        )}
        <div>
            <div className={scss.container}>
                <img src={chessLogo} alt="logo" className={scss.sidebarLogo}/>
                {user && (
                    <div className={scss.container}>
                        <div>
                            <div>
                                <img className={scss.avatar} src={user?.img ? user.img : defaultUserIcon}/>
                            </div>
                        </div>
                    </div>
                )}
                {user
                ? (<button onClick={userLogout} className={scss.sidebarButton}>Logout</button>)
                :(
                    <div style={{'display':'flex','justifyContent':'center','flexDirection':'column'}}>
                        <button onClick={openLoginWindow} className={scss.sidebarButton}>Login</button>
                        <button onClick={openRegisterWindow} className={scss.sidebarButton}>Register</button>
                    </div>
                )}
                {navigationLinks.map((link) => {
                    return (
                        <NavLink
                        key={link.text}
                        to={link.to}
                        className={({ isActive,isPending }) =>
                            isActive ? [scss.sidebarLink,scss.activeLink].join(' '): scss.sidebarLink
                        }
                        >
                        {link.text}
                        </NavLink>
                    )
                    })}
                    {isMobile && (
                    <button className={scss.playButton}>Play</button>
                    )}
            </div>
        </div>  
    </div>
  )
}

export default SideBar