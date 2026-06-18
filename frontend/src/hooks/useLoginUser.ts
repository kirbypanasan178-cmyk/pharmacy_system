import { loginUserAPI } from "../api/userAPI";
import { loginFailure, loginStart, loginSuccess } from "../features/authSlice";
import type { LoginFormType } from "../types/user";
import { useAppDispatch } from "./redux/reduxHooks";

export const useLoginUser = () => {
  const dispatch = useAppDispatch();

  const loginUser = async (form: LoginFormType) => {
    dispatch(loginStart());

    try {
      const data = await loginUserAPI(form);
      dispatch(loginSuccess(data));
      localStorage.setItem("user", JSON.stringify(data));
      return data; // 🔥 THIS FIXES YOUR ERROR
    } catch (error: any) {
      console.log(error);
      dispatch(loginFailure(error.message));

      return null; // optional safety
    }
  };

  return { loginUser };
};
