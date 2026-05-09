import { StringExpressionOperatorReturningBoolean } from "mongoose";

export interface ProductForm {
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    stock: number;
}