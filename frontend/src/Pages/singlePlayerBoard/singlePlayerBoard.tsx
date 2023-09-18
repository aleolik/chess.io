import BoardComponent from '../../components/ChessComponents/BoardComponent/BoardComponent'
import scss from './singlePlayerBoard.module.scss'

const SinglePlayerBoardPage = () => {

  return (
    <div className={scss.container}>  
        <BoardComponent/>
    </div>
  )
}

export default SinglePlayerBoardPage