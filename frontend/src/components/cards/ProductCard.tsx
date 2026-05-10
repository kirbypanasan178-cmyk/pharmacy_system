type ProductCardProps = {
    name: string
    category: string
    price: number
    image?: string
    onAdd?: () => void
    onWishList?: () => void
}

export const ProductCart = ({
    name,
    category,
    price,
    image,
    onAdd,
    onWishList,
}: ProductCardProps) => {
    return (
        <div className="card">

        </div>
    )
}