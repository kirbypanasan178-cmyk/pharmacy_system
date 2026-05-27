import { getAllUsersAPI } from "../../api/userAPI"
import { orderFailure } from "../../features/orderSlice"
import { userStart, userSuccess } from "../../features/userSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useGetAllUsers = () => {
    const dispatch = useAppDispatch()
    const getAllUsers = async () => {
        dispatch(userStart())
        try {
            const data = await getAllUsersAPI()
            console.log(data)
            dispatch(userSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(orderFailure(error))
        }
    }

    return { getAllUsers }
}