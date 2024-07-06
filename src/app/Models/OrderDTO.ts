import { ToDisplayOrderDTO } from './ToDisplayOrderDTO';
import { DeliveryDTO } from "./DeliveryDTO"

export class OrderDTO {
    id!: number;
    price!: number;
    paymentMethod!: number;
    hasSalt!: boolean;
    description!: string;
    orderDate!: any;
    deliveries!: Array<DeliveryDTO>;
    location!: string;

    constructor(orderDTO: ToDisplayOrderDTO) {
        this.id = orderDTO.Id;
        this.price = orderDTO.price;
        this.paymentMethod = orderDTO.paymentMethod;
        this.hasSalt = orderDTO.hasSalt;
        this.description = orderDTO.description;
        this.orderDate = orderDTO.orderDate;
        this.deliveries = orderDTO.deliveries;
        this.location = orderDTO.location;
    }
}