import { Component, EventEmitter, Input, Output, ComponentRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-resume',
  templateUrl: './order-resume.component.html',
  styleUrls: ['./order-resume.component.scss'],
})
export class OrderResumeComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() makeOrderEvent = new EventEmitter<void>();
  @Input() orders!: any;
  @Input() total!: number;
  @Input() consolidatedOrder!: any;
  @Input() finalDiscountedTotal!: number;

  minimoPlatosDescuento?: number;

  apiUrl = 'http://localhost:5009/api/configuracion/minimo-platos-descuento';

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) {}
  
  ngOnInit() {
    this.getMinimoPlatosDescuento();
  }

  getMinimoPlatosDescuento(): void {
    this.http.get<{ minimoPlatosDescuento: number }>(this.apiUrl).subscribe(response => {
      this.minimoPlatosDescuento = response.minimoPlatosDescuento;
      this.cdRef.detectChanges();
    });
  }

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
    if (this.minimoPlatosDescuento === undefined) {
      console.warn("Esperando el mínimo de platos desde el backend...");
      return false; // 🔹 No evaluamos el descuento hasta que se obtenga el valor real
    }

    const totalPlates = this.orders.reduce((total: number, order: any) => {
      return (
        total +
        order.deliveries.reduce((subtotal: number, delivery: any) => subtotal + delivery.quantity, 0)
      );
    }, 0);

    console.log(`Total Platos en Orden: ${totalPlates} | Mínimo requerido: ${this.minimoPlatosDescuento}`);

    return totalPlates >= this.minimoPlatosDescuento;
  }
}
