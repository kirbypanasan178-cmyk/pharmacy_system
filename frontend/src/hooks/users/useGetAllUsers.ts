import { getAllUsersAPI } from "../../api/userAPI"
import { userFailed, userStart, userSuccess } from "../../features/userSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useGetAllUsers = () => {
    const dispatch = useAppDispatch()
    const getAllUsers = async () => {
        dispatch(userStart())
        try {
            const data = await getAllUsersAPI()
            dispatch(userSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(userFailed(error))
        }
    }

    return { getAllUsers }
}