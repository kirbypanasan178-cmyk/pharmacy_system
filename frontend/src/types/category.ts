export interface CategoryFormType {
    name: string;
    description?: string;
}

export const categoryInitialFrom: CategoryFormType = {
    name: "",
    description: ""
}

export type CategoryFormTypeProps = {
    editingId: string | null;
    setEditingId: React.Dispatch<React.SetStateAction<string | null>>
    form: CategoryFormType;
    setForm: React.Dispatch<React.SetStateAction<CategoryFormType>>
}