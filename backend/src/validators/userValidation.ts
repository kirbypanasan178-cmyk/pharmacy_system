import { Request, Response, NextFunction } from "express";
import validator from "validator"

export const signupValidation = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password, fullname, phone, address, gender, age, birthdate, birthplace } = req.body;

    if (!email || !password || !fullname || !phone || !address || !gender || !age || !birthdate || !birthplace) {
        res.status(400).json({ error: "All fields must be filled" });
    }

    if (!validator.isEmail(email)) {
        res.status(400).json({ error: "Invalid email format" });
        return;
    }

    if(!validator.isStrongPassword(password)) {
        res.status(400).json({ error: "Password is too weak" })
        return
    }

    if (!validator.isMobilePhone(phone + "")) {
        res.status(400).json({ error: "Invalid phone number" });
        return;
    }

    next(); // move to controller if valid
};

export const loginValidation = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ error: "Email or password does not exist. Please sign up first."})
    }

    next()
}
