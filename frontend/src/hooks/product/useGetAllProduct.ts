import { getAllProductAPI } from "../../api/productAPI";
import {
  getALlProductFailure,
  getAllProductStart,
  getAllProductSuccess,
} from "../../features/productSlice";
import { useAppDispatch } from "../redux/reduxHooks";

export const useGetAllProduct = () => {
  const dispatch = useAppDispatch();
  const getAllProduct = async () => {
    dispatch(getAllProductStart());
    try {
      const data = await getAllProductAPI();
      console.log(data);
      dispatch(getAllProductSuccess(data));
    } catch (error: any) {
      console.log(error);
      dispatch(getALlProductFailure(error.message));
    }
  };

  return { getAllProduct };
};
