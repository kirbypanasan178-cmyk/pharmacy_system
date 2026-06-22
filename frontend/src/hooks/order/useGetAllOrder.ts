import { getAllOrderAPI } from "../../api/orderAPI"
import { getAllOrderSuccess, getOrderFailure, getOrderStart } from "../../features/orderSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useGetAllOrder = () => {
    const dispatch = useAppDispatch()
    const getAllOrder = async () => {
        dispatch(getOrderStart())
        try {
            const data = await getAllOrderAPI()
            dispatch(getAllOrderSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(getOrderFailure(error.message))
        }
    }

    return { getAllOrder }
}