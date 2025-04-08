import { OrdersService } from './../../Services/OrdersService/orders.service';
import { Component, EventEmitter, Input, input, Output, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { LocationDTO } from 'src/app/Models/LocationDTO';
import { PlaceOrderDTO } from 'src/app/Models/PlaceOrderDTO';
import { ResponseObject } from 'src/app/Models/Response/ResponseObj';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-add-details-modal',
  templateUrl: './add-details-modal.component.html',
  styleUrls: ['./add-details-modal.component.scss'],
})
export class AddDetailsModalComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() makeOrderEvent = new EventEmitter<void>();

  @Input() locations!: Array<LocationDTO>;
  @Input() orders!: PlaceOrderDTO;

  description: string = '';
  paymentMethod: number = -1;
  selectedLocation: string = 'empty';
  isSubmitting: boolean = false;
  response: ResponseObject = new ResponseObject();

  constructor(private loadingCtrl: LoadingController, private alertTool: AlertTool, private ordersService: OrdersService) {}
  
  ngOnInit(): void {
    this.setDefaultLocation();
  }

  setDefaultLocation() {
    if (this.locations.length > 0) {
      const defaultLocation = this.locations.find(e => e.isDefault);
      this.selectedLocation = defaultLocation ? defaultLocation.dir : this.locations[0].dir;
    }
  }

  handleSelectionDir(event: any) {
    if (event.detail.value === 'add_new') {
      this.alertTool.presentToastWithRedirect("No tienes direcciones guardadas. Apretar *IR* para agregar direccion.", "/profile");
    } else {
      this.selectedLocation = event.detail.value;
    }
  }

  closeModal() {
    this.closeModalEvent.emit();
  }


  makeOrder() {
    if (this.paymentMethod === -1 || this.selectedLocation === 'empty' || this.selectedLocation === 'add_new' || !this.selectedLocation) {
        this.alertTool.presentToast("⚠️ Debes seleccionar una dirección válida antes de enviar la orden.");
        return;
    }

    // 🚨 Validar fechas antes de enviar el pedido
    if (!this.isOrderValid()) {
        this.alertTool.presentToast("🚫 No puedes hacer pedidos para el mismo día, días pasados o de la próxima semana.");
        return;
    }

    // ✅ Si la validación pasa, completar datos y continuar
    this.orders.Orders.forEach(o => {
        o.id = 0;
        o.location = this.selectedLocation;
        o.description = this.description;
        o.paymentMethod = this.paymentMethod;
        o.hasSalt = false;
        o.orderDate = new Date();

        // Convertimos deliveryDate a Date en cada entrega
        o.deliveries.forEach(d => {
            d.deliveryDate = new Date(d.deliveryDate);
        });

        // Log para depuración
        console.log(`📦 Orden ID: ${o.id}, Fecha de orden: ${o.orderDate}, Método de pago: ${o.paymentMethod}, Ubicación: ${this.selectedLocation}`);
    });

    console.log('📦 Estructura final de las órdenes antes de enviar:', JSON.stringify(this.orders.Orders, null, 2));

    this.placeOrder();
}


isValidOrderDate(date: Date): boolean {
  const now = new Date();
  const currentDay = now.getDay(); // 0: domingo, 1: lunes, ..., 5: viernes, 6: sábado
  const currentTime = now.getHours() + now.getMinutes() / 60;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deliveryDate = new Date(date);
  deliveryDate.setHours(0, 0, 0, 0);

  // 🚫 1. No se puede pedir para días anteriores
  if (deliveryDate < today) return false;

  // 🚫 2. No se puede pedir para el mismo día después de las 8 AM
  if (deliveryDate.getTime() === today.getTime() && currentTime >= 8) return false;

  // 🚫 3. Bloqueo total los viernes desde las 8 AM hasta el sábado 00:00
  if (currentDay === 5 && currentTime >= 8) return false;
  //if (currentDay === 6 && currentTime < 24) return false;

  // 🚫 4. No se puede pedir para la próxima semana si es de lunes a viernes
  const daysUntilNextMonday = (8 - currentDay) % 7;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilNextMonday);

  if (deliveryDate >= nextMonday && currentDay >= 1 && currentDay <= 5) return false;

  return true;
}

isOrderValid(): boolean {
  return this.orders.Orders.every((order) =>
    order.deliveries.every((delivery) => {
      const deliveryDate = new Date(delivery.deliveryDate);
      return this.isValidOrderDate(deliveryDate);
    })
  );
}
 
    placeOrder() {
      this.isSubmitting = true; 
      this.makeLoadingAnimation();
  
      this.ordersService.PlaceOrder(this.orders).subscribe(
        response => {
          this.response = response as ResponseObject;
  
          if (this.response.statusCode === 200) {
            this.closeLoader();
            this.alertTool.presentToast("✅ Orden enviada con éxito!");
            this.makeOrderEvent.emit();
            this.closeModal(); 
          } else {
            this.closeLoader();
            this.alertTool.presentToast(this.response.message);
          }
  
          this.isSubmitting = false; 
        },
        error => {
          this.closeLoader();
          this.alertTool.presentToast("🚫 Error: No puedes hacer pedidos para el mismo día, días pasados o de la próxima semana. Los pedidos para la semana que viene se habilitan el viernes a las 10 AM.");
          this.isSubmitting = false; 
        }
      );
  }
  
  handleSelectionPay(event: any) {
    this.paymentMethod = event.detail.value;
  }

  makeLoadingAnimation() {
    this.loadingCtrl.getTop().then(hasLoading => {
      if (!hasLoading) {
          this.loadingCtrl.create({
              spinner: 'circular',
              cssClass: "custom-loading"
          }).then(loading => loading.present());
      }
  })
}

async closeLoader() {
  
  this.checkAndCloseLoader();

  setTimeout(() => this.checkAndCloseLoader(), 500);
}

async checkAndCloseLoader() {
 
 const loader = await this.loadingCtrl.getTop();
 
  if(loader !== undefined) { 
    await this.loadingCtrl.dismiss();
  }
  this.locations.forEach( e => {
    if(e.isDefault) {
       this.selectedLocation = e.dir;
    }
  });
}
}
