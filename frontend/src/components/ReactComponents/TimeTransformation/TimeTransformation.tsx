import {FC} from 'react'
import scss from './TimeTransformation.module.scss'

interface ITimeTransofrmationProps{
    time : number // in seconds
}
const TimeTransformation : FC<ITimeTransofrmationProps> = ({time}) => {  

   const mins = Math.floor(time / 60)

   const secs = time % 60


  return (
    <div className={scss.timeContainer}>
        {mins > 9 ? mins : `0${mins}`} :  {secs > 9 ? secs : `0${secs}`}
    </div>
  )
}

export default TimeTransformation