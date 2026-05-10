import { updateCategoryAPI } from "../../api/categoryAPI"
import { updateCategoryFailure, updateCategoryStart, updateCategorySuccess } from "../../features/categorySlice"
import type { CategoryFormType } from "../../types/category"
import { useAppDispatch } from "../redux/reduxHooks"

export const useUpdateCategory = () => {
    const dispatch = useAppDispatch()
    const updateCategory = async (id: string, form: CategoryFormType) => {
        dispatch(updateCategoryStart())
        try {
            const category = await updateCategoryAPI(id, form)
            dispatch(updateCategorySuccess(category))
        } catch (error: any) {
            console.log(error)
            dispatch(updateCategoryFailure(error))
        }
    }

    return { updateCategory }
}