import axiosPublic from '../../axios/publicInstance'

export const getRandomCorrectPassword = async() : Promise<string> => {
    const url = '/user/random-password'
    try {
        const response = await axiosPublic.get(url)

        if (response.status === 200){
            const data = response.data

            return data?.password
        }

        return ''
    } catch (error) {
        return ''
    }
} 