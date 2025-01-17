import { ToDisplayDeliveryDTO } from "./ToDisplayDeliveryDTO"

export class ToDisplayOrderDTO {
    Id!: number
    price!: number
    precioPromo?: number;
    dayOfWeek!: string
    paymentMethod!: number
    hasOrder!: Boolean
    hasSalt!: boolean
    description!: string
    orderDate!: string;
    deliveries!: Array<ToDisplayDeliveryDTO>
    location!: string;
}