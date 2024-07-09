import { DeliveryDTO } from "./DeliveryDTO";
import { OrderDTO } from "./OrderDTO";

export class ClientOrder {
    id!: number;
    price!: number;
    paymentMethod!: number;
    hasSalt!: boolean;
    description!: string;
    orderDate!: string;
    deliveries!: Array<DeliveryDTO>;
    location!: string;
    isCollapsed: boolean = true;

    constructor(orderDTO: OrderDTO) {
        this.id = orderDTO.id;
        this.price = orderDTO.price;
        this.paymentMethod = orderDTO.paymentMethod;
        this.hasSalt = orderDTO.hasSalt;
        this.description = orderDTO.description;
        this.orderDate = orderDTO.orderDate;
        this.deliveries = orderDTO.deliveries;
        this.location = orderDTO.location;
    }
}