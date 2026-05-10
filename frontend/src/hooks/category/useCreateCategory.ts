import { createCategoryAPI } from "../../api/categoryAPI"
import { createCategoryFailure, createCategoryStart, createCategorySuccess } from "../../features/categorySlice"
import type { CategoryFormType } from "../../types/category"
import { useAppDispatch } from "../redux/reduxHooks"

export const useCreateCategory = () => {
    const dispatch = useAppDispatch()
    const createCategory = async (form: CategoryFormType) => {
        dispatch(createCategoryStart())
        try {
            const category = await createCategoryAPI(form)
            dispatch(createCategorySuccess(category))
        } catch (error: any) {
            console.log(error)
            dispatch(createCategoryFailure(error))
        }
    }

    return { createCategory }
}