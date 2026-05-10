import { getAllCategoryAPI } from "../../api/categoryAPI"
import { getAllCategoryFailure, getAllCategoryStart, getAllCategorySuccess } from "../../features/categorySlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useGetAllCategory = () => {
    const dispatch = useAppDispatch()
    const getAllCategory = async () => {
        dispatch(getAllCategoryStart())
        try {
            const category = await getAllCategoryAPI()
            dispatch(getAllCategorySuccess(category))
        } catch (error: any) {
            console.log(error)
            dispatch(getAllCategoryFailure(error))
        }
    }

    return { getAllCategory }
}