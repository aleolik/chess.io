import React,{FC, MutableRefObject, useEffect, useRef} from 'react'
import scss from './RestartBoardButton.module.scss'

interface RestartBoardButtonProps{
    restart : (buttonRef : MutableRefObject<HTMLButtonElement | null>) => void
}

const RestartBoardButton : FC<RestartBoardButtonProps> = ({restart}) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        restart(buttonRef)
    },[])

    return (<button ref={buttonRef} className={[`btn btn-primary`,scss.restartButton].join(' ')}  onClick={(e) => restart(buttonRef)}>Restart game</button>
  )
}

export default RestartBoardButton