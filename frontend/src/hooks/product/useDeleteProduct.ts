import { deleteProductAPI } from "../../api/productAPI";
import {
  deleteProductFailure,
  deleteProductStart,
  deleteProductSuccess,
} from "../../features/productSlice";
import { useAppDispatch } from "../redux/reduxHooks";

export const useDeleteProduct = () => {
  const dispatch = useAppDispatch();

  const deleteProduct = async (id: string) => {
    dispatch(deleteProductStart());
    try {
      const data = await deleteProductAPI(id);
      dispatch(deleteProductSuccess(data._id));
    } catch (error: any) {
      dispatch(deleteProductFailure(error));
    }
  };

  return { deleteProduct };
};
