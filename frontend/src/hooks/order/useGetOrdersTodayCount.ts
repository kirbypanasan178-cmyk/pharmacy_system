import { getOrdersTodayCountAPI } from "../../api/orderAPI"

export const useGetOrdersTodayCount = () => {
    const getOrdersTodayCount = async () => {
        try {
            const ordersTodayCount = await getOrdersTodayCountAPI()
            console.log("Orders Today: ", ordersTodayCount)

            return ordersTodayCount
        } catch (error: any) {
            console.error
        }
    }

    return { getOrdersTodayCount }
}