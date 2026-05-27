import { unblockUserAPI } from "../../api/userAPI"
import { updateUserSuccess, userFailed, userStart } from "../../features/userSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useUnBlockUser = () => {
    const dispatch = useAppDispatch()
    const unblockUser = async (id: string) => {
        dispatch(userStart())
        try {
            const data = await unblockUserAPI(id)
            console.log(data)
            dispatch(updateUserSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(userFailed(error))
        }
    }

    return { unblockUser }
}