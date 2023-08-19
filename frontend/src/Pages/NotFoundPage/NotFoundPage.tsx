import React from 'react'
import scss from './NotFoundPage.module.scss'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {

  const navigte = useNavigate()
  return (
    <div className={scss.container}>
        <h6 className={scss.text}>404</h6>
        <h6 className={scss.text}>(something went wrong...)</h6>
        <button className={scss.btn} onClick={() => navigte('/')}>Go Home</button>
    </div>
  )
}

export default NotFoundPage