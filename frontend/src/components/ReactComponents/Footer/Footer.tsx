import React from 'react'
import scss from './Footer.module.scss'
const Footer = () => {
  return (
    <div className={scss.bottomContainer}>
        <div className={scss.footer}>
          <h4>Made by</h4>
          <div className={scss.githubLink}>
              <a href='https://github.com/aleolik/chess.io/' target="_blank">aleolik</a>
          </div>
          <h6 className={scss.text}>(github)</h6>
        </div>
    </div>
  )
}

export default Footer