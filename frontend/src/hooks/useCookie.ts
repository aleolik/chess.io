import {useEffect, useState } from 'react'
import { useAppSelector } from '../redux/hooks/useAppSelector';
import userInstance from '../axios/userInstance';

function useCookie(cookieName : string,dependencies : any | Array<any>) : string {
    const [cookieToReturn,setCookieToReturn] = useState<string>('')
    function handleCookieChange() {
        const url = '/user/auth'
        userInstance.get(url).then((res) => {
          const token = res.data.token as string
          setCookieToReturn(token)
        }).catch((err) => {
          setCookieToReturn("")
        })  
    }

    useEffect(() => {
       handleCookieChange()
    },[Array.isArray(dependencies) ? [...dependencies] : dependencies])
  
    return cookieToReturn
}

export default useCookie