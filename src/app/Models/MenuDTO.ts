import { ProductDTO } from "./ProductDTO"

export class MenuDTO {
    Id!: number
    category!: string
    validDate!: Date
    products!: Array<ProductDTO>
}