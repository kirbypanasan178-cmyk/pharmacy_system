import { updateUserAPI } from "../../api/userAPI"
import { orderFailure } from "../../features/orderSlice"
import { updateUserSuccess, userStart } from "../../features/userSlice"
import type { User } from "../../types/user"
import { useAppDispatch } from "../redux/reduxHooks"

export const useUpdateUser = () => {
    const dispatch = useAppDispatch()
    const updateUser = async (userId: string, form: User) => {
        dispatch(userStart())
        try {
            const data = await updateUserAPI(userId, form)
            console.log(data)
            dispatch(updateUserSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(orderFailure(error))
        }
    }

    return { updateUser }
}