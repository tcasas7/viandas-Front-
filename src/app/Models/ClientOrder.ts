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
  totalPlates: number = 0;
  daysOfWeek: string[] = [];
  menuCounts: { estandar: number; light: number; proteico: number } = { estandar: 0, light: 0, proteico: 0 };
  menuTypes: { estandar: number, light: number, proteico: number } = {
    estandar: 0,
    light: 0,
    proteico: 0
  };

  constructor(orderDTO: OrderDTO) {
    // Inicializar propiedades de OrderDTO en ClientOrder
    this.id = orderDTO.id;
    this.price = orderDTO.price;
    this.paymentMethod = orderDTO.paymentMethod;
    this.hasSalt = orderDTO.hasSalt;
    this.description = orderDTO.description;
    this.orderDate = orderDTO.orderDate;
    this.deliveries = orderDTO.deliveries;
    this.location = orderDTO.location;

    // Inicializar propiedades específicas de ClientOrder
    this.totalPlates = orderDTO.totalPlates;
    this.daysOfWeek = orderDTO.daysOfWeek;

    this.deliveries.forEach(delivery => {
      if (delivery.menuId === 1) this.menuTypes.estandar += delivery.quantity;
      if (delivery.menuId === 2) this.menuTypes.light += delivery.quantity;
      if (delivery.menuId === 3) this.menuTypes.proteico += delivery.quantity;
    });
    
  }
}
