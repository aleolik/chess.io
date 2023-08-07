import React from 'react'
import { useAppSelector } from '../../redux/hooks/useAppSelector'
import scss from './AuthPage.module.scss'

enum roles{
    ADMIN="ADMIN",
    USER="USER"
}
interface AuthPageProps{
    children : React.ReactElement
}

interface BlockedPageProps{
    needRoleToHave : roles
}
const BlockedPage : React.FC<BlockedPageProps> = ({needRoleToHave}) : React.ReactElement => {
    return <div className={scss.container}>You need to have role "{needRoleToHave}" to access this page!</div>
}
const AuthPage : React.FC<AuthPageProps> = ({ children }) : React.ReactElement => {
    const user = useAppSelector(state => state.user)
    const gameData = useAppSelector(state => state.webSocket.gameData)

    if (user && gameData && gameData.gameActive) {
        return <div></div>
    } else {
        return <BlockedPage needRoleToHave={roles.USER}/>
    }
}

export default AuthPage