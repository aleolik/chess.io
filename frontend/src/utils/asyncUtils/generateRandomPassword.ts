import { AxiosError } from 'axios'
import axiosPublic from '../../axios/publicInstance'

export const getRandomCorrectPassword = async() : Promise<string | AxiosError> => {
    const url = '/user/random-password'
    try {
        const response = await axiosPublic.get(url)
        const data = response.data
        return data.password
    } catch (error) {
        return error as AxiosError
    }
} 