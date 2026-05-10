import Category from "../models/categoryModel"

interface CategoryForm {
    name: string;
    description: string;
}

export const createCategoryService = async (form: CategoryForm) => {
    try {
        const category = await Category.create(form)

        return category
    } catch (error) {
        console.log(error)

        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to create category"
        )
    }
}

export const getAllCategoryService = async () => {
    try {
        const category = await Category.find()

        return category
    } catch (error) {
        console.log(error)

        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to get categories"
        )
    }
}

export const updateCategoryService = async (
    id: string,
    form: CategoryForm
) => {
    try {
        const category = await Category.findByIdAndUpdate(
            id,
            form,
            { returnDocument: "after" }
        )

        return category
    } catch (error) {
        console.log(error)

        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to update category"
        )
    }
}

export const deleteCategoryService = async (id: string) => {
    try {
        const category = await Category.findByIdAndDelete(id)

        return category
    } catch (error) {
        console.log(error)

        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to delete category"
        )
    }
}