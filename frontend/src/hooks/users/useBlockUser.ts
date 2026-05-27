import { blockUserAPI } from "../../api/userAPI"
import { updateUserSuccess, userFailed, userStart } from "../../features/userSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useBlockUser = () => {
    const dispatch = useAppDispatch()
    const blockUser = async (id: string) => {
        dispatch(userStart())
        try {
            const data = await blockUserAPI(id)
            console.log(data)
            dispatch(updateUserSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(userFailed(error))
        }
    }

    return { blockUser }
}