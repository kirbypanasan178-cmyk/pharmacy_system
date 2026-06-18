import { signupUserAPI } from "../api/userAPI"
import { loginFailure, loginStart } from "../features/authSlice"
import type { SignupFormType } from "../types/user"
import { useAppDispatch } from "./redux/reduxHooks"

export const useSignupUser = () => {
    const dispatch = useAppDispatch()
    const signupUser = async (form: SignupFormType) => {
        dispatch(loginStart())
        try {
        const data = await signupUserAPI(form)

        return data
    } catch (error: any) {
        console.log("Cannot create account: ", error)
        dispatch(loginFailure(error.message))
    }
    }

    return { signupUser }
}