import { signupUserAPI } from "../api/userAPI"
import type { SignupFormType } from "../types/user"

export const useSignupUser = () => {
    const signupUser = async (form: SignupFormType) => {
        try {
        const data = await signupUserAPI(form)
        console.log(data)
    } catch (error) {
        console.log(error)
    }
    }

    return { signupUser }
}