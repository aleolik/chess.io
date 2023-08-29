import React, { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../../redux/hooks/useAppSelector'
import scss from './AuthPage.module.scss'
import Loader from '../../components/ReactComponents/Loader/Loader'

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
const AuthPage : React.FC<AuthPageProps> = ({ children }) : any => {
    const {user,userOnLoad,userOnError} = useAppSelector(state => state.user)
    const {ws} = useAppSelector(state => state.webSocket)
    
    const [shouldRender,setShouldRender] = useState<boolean>(false)

    useEffect(() => {
        const timerId = setTimeout(() => {
            setShouldRender(true)
          },100);

      
          return () => clearTimeout(timerId);
    }, []);


    return(
        <>
            {shouldRender === false
            ? (<div style={{'display':'flex','justifyContent':'center','alignItems':'center'}}><Loader/></div>)
            : (
                <>
                    {!userOnLoad && !userOnError
                    ? (
                        <>
                            {user && ws 
                            ? (<div>{children}</div>)
                            : (<div><BlockedPage needRoleToHave={roles.USER}/></div>)}
                        </>)
                    : (
                        <>
                            {userOnError
                            ? (<div className={scss.text}>{userOnError}</div>)
                            : (<>{userOnLoad
                                ? (<div><Loader/></div>)
                                : (<></>)}
                            </>)}
                        </>)}
                </>
            )}
        </>
    )


}

export default AuthPage