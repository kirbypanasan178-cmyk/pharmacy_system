import { updateUserAPI } from "../../api/userAPI"
import { userFailed, userStart } from "../../features/userSlice"
import type { ProfileFormType } from "../../types/user"
import { useAppDispatch } from "../redux/reduxHooks"

export const useUpdateUser = () => {
    const dispatch = useAppDispatch()
    const updateUser = async (userId: string, form: ProfileFormType) => {
        dispatch(userStart())
        try {
            const data = await updateUserAPI(userId, form)
            return data
        } catch (error: any) {
            console.log(error)
            dispatch(userFailed(error))
        }
    }

    return { updateUser }
}