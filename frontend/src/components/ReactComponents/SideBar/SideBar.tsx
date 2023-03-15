import React from 'react'
import scss from './SideBar.module.scss'
import UiError from '../../../Error/UiError'

const SideBar = () => {

  return (
    <div className={scss.sideBar}>
        <div className={scss.logo}></div>
        <button>Logo</button>
        <button>Register</button>
        <button>Login</button>
    </div>
  )
}

export default SideBar