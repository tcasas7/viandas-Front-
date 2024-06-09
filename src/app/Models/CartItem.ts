export class CartItem {
    Id!: number;
    day!: number
    name: string = "";
    price: number = 0;
    category!: string;
    img!: any;
    cartPressed: boolean = false;
    total: number = 0;
    image!: string;
}