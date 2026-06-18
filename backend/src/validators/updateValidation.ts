import { Request, Response, NextFunction } from "express";
import validator from "validator"

export const updateValidation = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password, fullname, phone, gender, age, birthdate, birthplace } = req.body;

    if (!email || !fullname || !phone || !gender || !age || !birthdate || !birthplace) {
        res.status(400).json({ error: "All fields must be filled" });
        return;
    }

    if (!validator.isEmail(email)) {
        res.status(400).json({ error: "Invalid email format" });
        return;
    }

    if (!validator.isMobilePhone(phone + "")) {
        res.status(400).json({ error: "Invalid phone number" });
        return;
    }

    next();
};