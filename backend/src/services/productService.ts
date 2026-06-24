import { Request, Response } from "express"
import { ProductForm } from "../types/product"
import Product from "../models/productModel"
import { Types } from "mongoose";

export const createProductService = async (form: ProductForm) => {
  try {
    const product = await Product.create(form);
    return product;
  } catch (error) {
    console.error("RAW ERROR:", JSON.stringify(error, null, 2)) // 👈 add this
    throw new Error(
      error instanceof Error ? error.message : "Failed to create product"
    );
  }
};

export const getProductService = async (id: string) => {
    try {
        const product = await Product.findById(id)

        return product
    } catch (error) {
        throw new Error(
      error instanceof Error ? error.message : "Failed to get product"
    );
    }
}

export const getAllProductsService = async () => {
    try {
        const products = await Product.find().populate("category")
        return products
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to get all products")
    }
}

export const updateProductService = async (id: string, form: ProductForm) => {
    try {
        const product = await Product.findByIdAndUpdate(
            id,
            { $set: form},
            { returnDocument: "after"}
        )
        return product
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update product")
    }
}

export const deleteProductService = async (id: string) => {
    try {
        const product = await Product.findByIdAndDelete(id)
        
        return product
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to delete product")
    }
    
}  

export const decreaseStockService = async (
    items: { product: Types.ObjectId | string, quantity: number }[]
) => {
    try {
        const operations = items.map(item => ({
            updateOne: {
                filter: {
                    _id: item.product,              // find product by Id
                    stock: { $gte: item.quantity }  // prevent stock from going negative
                },  // if stock is not enough, this product will not be updated
                update: {
                    $inc: { stock: -item.quantity }
                }
            },
        }))

        // bulKWrite lets you execute many databases operations in a single request
        // ordered: true executes operation one by one, if one fails, it stops immediately
        const result = await Product.bulkWrite(operations, { ordered: true })

        if (result.modifiedCount !== items.length) {
            throw new Error("Insufficient stock for one or more products")
        }

        return result

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to decrease stock")
    }
}