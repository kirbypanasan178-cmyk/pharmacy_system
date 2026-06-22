import { useMemo, useState } from "react"
import { useAppSelector } from "../redux/reduxHooks"

export const useProductFilters = () => {
    const [search, setSearch] = useState<string>("")
    const [category, setCategory] = useState("all")
    const products = useAppSelector((state) => state.product.products)

    const filteredProducts = useMemo(() => {
        const searchTerm = search.toLowerCase()

        return products.filter((product) => {
            const stockStatus = 
                product.stock === 0
                ? "out of stock"
                : product.stock < 10
                ? "low stock"
                : "in  stock"

            const matchesSearch = 
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.name.toLowerCase().includes(searchTerm) ||
                stockStatus.includes(searchTerm)

            const matchesCategory = 
                category === "all" || 
                product.category.name === category

            return matchesSearch && matchesCategory
    })
    }, [products, search, category])
        

    return {
        search,
        setSearch,
        category,
        setCategory,
        filteredProducts,
    }


}