import { ToDisplayOrderDTO } from './ToDisplayOrderDTO';
import { DeliveryDTO } from "./DeliveryDTO"
import { DayOfWeek } from './Enums/DayOfWeekEnums';

export class OrderDTO {
    id!: number;
    price!: number;
    precioPromo?: number
    paymentMethod!: number;
    hasSalt!: boolean;
    description!: string;
    orderDate!: Date;
    deliveries!: Array<DeliveryDTO>;
    location!: string;
    isCollapsed: boolean = false; // Propiedad para la visualización
    totalPlates: number = 0;
    daysOfWeek: string[] = [];

    constructor(orderDTO: ToDisplayOrderDTO) {
        this.id = orderDTO.Id;
        this.price = orderDTO.price;
        this.precioPromo = orderDTO.precioPromo;
        this.paymentMethod = orderDTO.paymentMethod;
        this.hasSalt = orderDTO.hasSalt;
        this.description = orderDTO.description;
        this.orderDate = new Date(orderDTO.orderDate);  // ✅ Convertir a Date al asignarlo
        this.deliveries = orderDTO.deliveries.filter(delivery => delivery.quantity > 0);
        this.location = orderDTO.location;

        // Convertir deliveryDate de string a Date en cada entrega
        this.deliveries.forEach(delivery => {
            delivery.deliveryDate = new Date(delivery.deliveryDate); // ✅ Convertir a Date
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