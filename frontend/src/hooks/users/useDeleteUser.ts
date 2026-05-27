import { deleteUserAPI } from "../../api/userAPI"
import { orderFailure } from "../../features/orderSlice"
import { userStart, userSuccess } from "../../features/userSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useDeleteUser = () => {
    const dispatch = useAppDispatch()
    const deleteUser = async (userId: string) => {
        dispatch(userStart())
        try {
            const data = await deleteUserAPI(userId)
            console.log(data)
            dispatch(userSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(orderFailure(error))
        }
    }

    return { deleteUser }
}