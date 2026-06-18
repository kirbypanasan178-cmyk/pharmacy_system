import { getSalesTodayAPI } from "../../api/orderAPI"

export const useGetSalesToday = () => {
    const getSalesToday = async () => {
        try {
            const salesToday = await getSalesTodayAPI()
            console.log("Sales Today: ", salesToday)

            return salesToday
        } catch (error: any) {
            console.error
        }
    }

    return { getSalesToday }
}