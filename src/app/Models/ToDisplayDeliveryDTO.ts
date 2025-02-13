export class ToDisplayDeliveryDTO {
    Id!: number;
    productId!: number;
    productName!: string;
    productPrice!: number;
    delivered!: boolean;
    deliveryDate!: Date;
    quantity!: number;
    menuId!: number; 
    precioPromo?: number;
    productPromoPrice!: number;
    appliedPrice!: number; 
    discountApplied!: boolean;
}