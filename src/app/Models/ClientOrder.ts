import { DeliveryDTO } from "./DeliveryDTO";
import { OrderDTO } from "./OrderDTO";

export class ClientOrder {
  id!: number;
  price!: number;
  paymentMethod!: number;
  hasSalt!: boolean;
  description!: string;
  orderDate!: Date;
  deliveries!: Array<DeliveryDTO>;
  location!: string;
  isCollapsed: boolean = true;
  totalPlates: number = 0;
  daysOfWeek: string[] = [];
  menuCounts: { estandar: number; light: number; proteico: number } = { estandar: 0, light: 0, proteico: 0 };
  menuTypes: { estandar: number, light: number, proteico: number } = {
    estandar: 0,
    light: 0,
    proteico: 0
  };
  groupedDeliveries: { [date: string]: { type: string; quantity: number }[] } = {};


  constructor(orderDTO: OrderDTO) {
    
    this.id = orderDTO.id;
    this.price = orderDTO.price;
    this.paymentMethod = orderDTO.paymentMethod;
    this.hasSalt = orderDTO.hasSalt;
    this.description = orderDTO.description;
    this.orderDate = orderDTO.orderDate;
    this.deliveries = orderDTO.deliveries;
    this.location = orderDTO.location;
    this.totalPlates = 0;

    
    this.totalPlates = orderDTO.totalPlates;
    this.daysOfWeek = orderDTO.daysOfWeek;

    this.deliveries.forEach(delivery => {
      const deliveryDate = new Date(delivery.deliveryDate).toLocaleDateString("es-ES");

      // ✅ Agrupar por fecha
      if (!this.groupedDeliveries[deliveryDate]) {
        this.groupedDeliveries[deliveryDate] = [];
      }

      let type = "Desconocido";
      if (delivery.menuId === 1) {
        type = "Estandar";
        this.menuCounts.estandar += delivery.quantity;
      } else if (delivery.menuId === 2) {
        type = "Light";
        this.menuCounts.light += delivery.quantity;
      } else if (delivery.menuId === 3) {
        type = "Proteico";
        this.menuCounts.proteico += delivery.quantity;
      }

      this.groupedDeliveries[deliveryDate].push({ type, quantity: delivery.quantity });
      this.totalPlates += delivery.quantity || 0; 
    });
  }
}