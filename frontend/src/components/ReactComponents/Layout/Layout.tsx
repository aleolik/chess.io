import React from 'react'
import {Outlet} from 'react-router-dom'
import SideBar from '../SideBar/SideBar'
import scss from './Layout.module.scss'
import Footer from '../Footer/Footer'
import { useAppSelector } from '../../../redux/hooks/useAppSelector'
import Loader from '../Loader/Loader'

const Layout = () => {
  const {userOnLoad} = useAppSelector(state => state.user)
  return (
    <div className={scss.layout}>
        <SideBar/>
        {userOnLoad
        ? (
        <div className={scss.outlet_container_centered}>
          <h6 className={scss.text}>user loading...</h6>
          <Loader/>
        </div>)
        : (<div className={scss.outlet_container}><Outlet></Outlet></div>)}
        <Footer/>
    </div>
  )
}

export default Layout