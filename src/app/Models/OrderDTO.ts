import { ToDisplayOrderDTO } from './ToDisplayOrderDTO';
import { DeliveryDTO } from "./DeliveryDTO"

export class OrderDTO {
    id!: number;
    price!: number;
    paymentMethod!: number;
    hasSalt!: boolean;
    description!: string;
    orderDate!: string;
    deliveries!: Array<DeliveryDTO>;
    location!: string;
    dayOfWeek: any;

    constructor(orderDTO: ToDisplayOrderDTO) {
        this.id = orderDTO.Id;
        this.price = orderDTO.price;
        this.paymentMethod = orderDTO.paymentMethod;
        this.hasSalt = orderDTO.hasSalt;
        this.description = orderDTO.description;
        this.orderDate = orderDTO.orderDate;
        this.deliveries = orderDTO.deliveries;
        this.location = orderDTO.location;
   
        this.deliveries.forEach(delivery =>{
            delivery.deliveryDate = this.getDayAsNumber(delivery.deliveryDate);
        });
    }

    getDayAsNumber(day: number) :number{
        return day >= 1 && day <= 5 ? day : 0 
    }
}