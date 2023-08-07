import React from 'react'
import {Outlet} from 'react-router-dom'
import SideBar from '../SideBar/SideBar'
import scss from './Layout.module.scss'
import Footer from '../Footer/Footer'

const Layout = () => {
  return (
    <div className={scss.layout}>
        <SideBar/>
        <div className={scss.outlet_container}><Outlet></Outlet></div>
        <Footer/>
    </div>
  )
}

export default Layout