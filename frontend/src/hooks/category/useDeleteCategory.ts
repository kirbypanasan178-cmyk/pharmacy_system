import { deleteCategoryAPI } from "../../api/categoryAPI"
import { deleteCategoryFailure, deleteCategoryStart, deleteCategorySuccess } from "../../features/categorySlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useDeleteCategory = () => {
    const dispatch = useAppDispatch()
    const deleteCategory = async (id: string) => {
        dispatch(deleteCategoryStart())
        try {
            await deleteCategoryAPI(id)
            dispatch(deleteCategorySuccess(id))
        } catch (error: any) {
            console.log(error)
            dispatch(deleteCategoryFailure(error.message))
        }
    }

    return { deleteCategory }
}