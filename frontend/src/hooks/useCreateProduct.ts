import { createProductAPI } from "../api/productAPI";
import { createProductFailure, createProductStart, createProductSuccess } from "../features/productSlice";
import type { ProductFormType } from "../types/product";
import { useAppDispatch } from "./redux/reduxHooks";

export const useCreateProduct = () => {
    const dispatch = useAppDispatch()
    const createProduct = async (form: ProductFormType) => {
        dispatch(createProductStart())
        try {
            const product = await createProductAPI(form)
            dispatch(createProductSuccess(product))
            console.log(product);
        } catch (error: any) {
            console.log(error);
            dispatch(createProductFailure(error))
        }
    };

    return { createProduct }
};
