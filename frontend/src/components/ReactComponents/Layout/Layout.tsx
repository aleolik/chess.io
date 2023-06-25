import React from 'react'
import {Outlet} from 'react-router-dom'
import SideBar from '../SideBar/SideBar'
import scss from './Layout.module.scss'
import { useAppSelector } from '../../../redux/hooks/useAppSelector'
import BottomMenu from '../BottomMenu/BottomMenu'

const Layout = () => {
  const showModal = useAppSelector(state => state.modal.showModal)
  return (
    <div className={scss.layout}>
        <SideBar/>
        <Outlet></Outlet>
    </div>
  )
}

export default Layout