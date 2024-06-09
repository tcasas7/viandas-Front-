import { DeliveryDTO } from "./DeliveryDTO"

export class OrderDTO {
    Id!: number
    price!: number
    paymentMethod!: number
    hasSalt!: Boolean
    description!: string
    orderDate!: Date
    deliveries!: Array<DeliveryDTO>
}