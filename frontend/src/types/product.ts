export interface ProductFormType {
    name: string;
    price: number;
    description: string;
    category: string;
    image: File | null;
    stock: number;
}

export const productInitialForm: ProductFormType = {
    name: "",
    price: 0,
    description: "",
    image: null,
    category: "",
    stock: 0,
}

export type ProductFormTypeProps = {
    editingId: string | null;
    setEditingId: React.Dispatch<React.SetStateAction<string | null>>

    form: ProductFormType
    setForm: React.Dispatch<React.SetStateAction<ProductFormType>>
}