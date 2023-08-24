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
    return <div className={scss.container}>
        <div className={scss.text}>You need to login as "{needRoleToHave.toLowerCase()}" to access the page</div>
    </div>
}
const AuthPage : React.FC<AuthPageProps> = ({ children }) : React.ReactElement => {
    const user = useAppSelector(state => state.user)
    const {ws} = useAppSelector(state => state.webSocket)

    if (user && ws) {
        return (
            <div>
                {children}
            </div>
        )
    } else {
        return <BlockedPage needRoleToHave={roles.USER}/>
    }
}

export default AuthPage