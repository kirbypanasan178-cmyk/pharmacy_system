import { getOrderAPI } from "../../api/orderAPI"
import { getOrderByIdSuccess, getOrderFailure, getOrderStart } from "../../features/orderSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useGetOrderById = () => {
    const dispatch = useAppDispatch()
    const getOrderById = async (id: string) => {
        dispatch(getOrderStart())
        try {
            const data = await getOrderAPI(id)
            dispatch(getOrderByIdSuccess(data))
            return data
        } catch (error: any) {
            console.log(error)
            dispatch(getOrderFailure(error.message))
            }
        }
    return { getOrderById }
}