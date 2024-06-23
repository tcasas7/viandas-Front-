import { ProductDTO } from "./ProductDTO"

export class MenuDTO {
    Id!: number;
    category!: string;
    validDate!: Date;
    price!: number;
    products!: Array<ProductDTO>;
}