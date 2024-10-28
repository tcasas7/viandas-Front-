import { ToDisplayOrderDTO } from './ToDisplayOrderDTO';
import { DeliveryDTO } from "./DeliveryDTO"
import { DayOfWeek } from './Enums/DayOfWeekEnums';

export class OrderDTO {
    id!: number;
    price!: number;
    paymentMethod!: number;
    hasSalt!: boolean;
    description!: string;
    orderDate!: string;
    deliveries!: Array<DeliveryDTO>;
    location!: string;
    dayOfWeek: DayOfWeek = DayOfWeek.Monday;
    isCollapsed: boolean = false; // Propiedad para la visualización
    totalPlates: number = 0;
    daysOfWeek: string[] = [];

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

    getDayAsNumber(day: DayOfWeek): number {
        // Mapea el enum DayOfWeek a números (Lunes a Viernes = 1-5)
        switch (day) {
            case DayOfWeek.Monday: return 1;
            case DayOfWeek.Tuesday: return 2;
            case DayOfWeek.Wednesday: return 3;
            case DayOfWeek.Thursday: return 4;
            case DayOfWeek.Friday: return 5;
            default: return 0;  // Si el día es inválido
        }
    }
}