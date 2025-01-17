import { Component, EventEmitter, Input, Output, ComponentRef } from '@angular/core';

@Component({
  selector: 'app-order-resume',
  templateUrl: './order-resume.component.html',
  styleUrls: ['./order-resume.component.scss'],
})
export class OrderResumeComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() makeOrderEvent = new EventEmitter<void>();
  @Input() orders!: any;
  @Input() total!: number;
  @Input() consolidatedOrder!: any;
  @Input() finalDiscountedTotal!: number;

  constructor() {}
  
  closeModal() {
    this.closeModalEvent.emit();
  }

  makeOrder() {
    this.makeOrderEvent.emit();
  }

  getDayName(dayNumber: number): string {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    return days[dayNumber - 1] || 'Desconocido';
  }
  
  applyGlobalDiscount(): boolean {
    const totalPlates = this.orders.reduce((total: number, order: any) => {
      return (
        total +
        order.deliveries.reduce((subtotal: number, delivery: any) => subtotal + delivery.quantity, 0)
      );
    }, 0);

    return totalPlates >= 4;
  }
}

