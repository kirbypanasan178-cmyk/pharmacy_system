import { getOrderAPI } from "../../api/orderAPI"
import { orderStart, orderSuccess } from "../../features/orderSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useGetOrder = () => {
    const dispatch = useAppDispatch()
    const getOrder = async (id: string) => {
        dispatch(orderStart())
        try {
            const data = await getOrderAPI(id)
            dispatch(orderSuccess(data))
        } catch (error: any) {
            console.log(error)
            }
        }
    return { getOrder }
}