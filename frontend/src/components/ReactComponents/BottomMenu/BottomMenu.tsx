import React from 'react'
import scss from './BottomMenu.module.scss'
const BottomMenu = () => {
  return (
    <div className={scss.bottomContainer}>
        <h4>Made by</h4>
        <div className={scss.githubLink}>
            <a href='https://github.com/aleolik/chess.io/' target="_blank">aleolik</a>
        </div>
        <h6>(github)</h6>
    </div>
  )
}

export default BottomMenu