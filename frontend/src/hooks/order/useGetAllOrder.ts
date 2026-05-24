import { getAllOrderAPI } from "../../api/orderAPI"
import { orderFailure, orderSuccess } from "../../features/orderSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useGetAllOrder = () => {
    const dispatch = useAppDispatch()
    const getAllOrder = async () => {
        try {
            const data = await getAllOrderAPI()
            dispatch(orderSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(orderFailure(error.message))
        }
    }

    return { getAllOrder }
}