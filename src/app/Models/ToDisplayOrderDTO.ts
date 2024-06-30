import { ToDisplayDeliveryDTO } from "./ToDisplayDeliveryDTO"

export class ToDisplayOrderDTO {
    Id!: number
    price!: number
    dayOfWeek!: string
    paymentMethod!: number
    hasOrder!: Boolean
    hasSalt!: Boolean
    description!: string
    orderDate!: Date;
    deliveries!: Array<ToDisplayDeliveryDTO>
    location!: string;
}