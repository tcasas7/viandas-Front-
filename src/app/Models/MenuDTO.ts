import { ProductDTO } from "./ProductDTO"

export class MenuDTO {
    id!: number;
    category!: string;
    products: ProductDTO[] = [];
    price!: number;
  }