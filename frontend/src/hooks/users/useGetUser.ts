import { getUserAPI } from "../../api/userAPI"
import { orderFailure } from "../../features/orderSlice"
import { userStart, userSuccess } from "../../features/userSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useGetUser = () => {
    const dispatch = useAppDispatch()
    const getUser = async (userId: string) => {
        dispatch(userStart())
        try {
            const data = await getUserAPI(userId)
            console.log(data)
            dispatch(userSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(orderFailure(error))
        }
    }

    return { getUser }
}