import { updateProductAPI } from "../api/productAPI"
import { updateProductFailure, updateProductSuccess } from "../features/productSlice"
import type { ProductFormType } from "../types/product"
import { useAppDispatch } from "./redux/reduxHooks"

export const useUpdateProduct = () => {
    const dispatch = useAppDispatch()

    const updateProduct = async (id: string, form: ProductFormType) => {
        try {
            const data = await updateProductAPI(id, form)
            dispatch(updateProductSuccess(data))
        } catch (error: any) {
            dispatch(updateProductFailure(error))
        }
    }

    return { updateProduct }
}