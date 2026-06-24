import { getUserAPI } from "../../api/userAPI"
import {  } from "../../features/orderSlice"
import { setUser, userFailed, userStart } from "../../features/userSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useGetUser = () => {
    const dispatch = useAppDispatch()
    const getUser = async (userId: string) => {
        dispatch(userStart())
        try {
            const data = await getUserAPI(userId)
            dispatch(setUser(data))
            return data
        } catch (error: any) {
            console.log(error)
            dispatch(userFailed(error))
        }
    }

    return { getUser }
}