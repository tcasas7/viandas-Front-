export class CartItem {
    name!: string;
    price: number = 0;
    category!: string;
    img!: any;
    cartPressed: boolean = false;
    total: number = 0;
}