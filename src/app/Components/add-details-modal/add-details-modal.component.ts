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
  
  response: ResponseObject = new ResponseObject();

  constructor(private loadingCtrl: LoadingController, private alertTool: AlertTool, private ordersService: OrdersService) {}

  closeModal() {
    this.closeModalEvent.emit();
  }


  makeOrder() {
    if (this.paymentMethod === -1 || this.selectedLocation === 'empty') {
        this.alertTool.presentToast("Campos vacíos, por favor llene todos los campos.");
        return;
    }

    // 🚨 Validar fechas antes de enviar el pedido
    if (!this.isOrderValid()) {
        this.alertTool.presentToast("🚫 Error: No puedes hacer pedidos para el mismo día, días pasados o de la próxima semana.");
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

isOrderValid(): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

  return this.orders.Orders.every((order) =>
      order.deliveries.every((delivery) => {
          let deliveryDate = new Date(delivery.deliveryDate);
          deliveryDate.setHours(0, 0, 0, 0);

          let deliveryDayOfWeek = deliveryDate.getDay(); 

          // 🚨 No permitir pedidos para el mismo día o días pasados
          if (deliveryDate <= today) {
              console.warn(`🚫 Pedido bloqueado: No se puede pedir para el mismo día o días pasados (${deliveryDate.toDateString()}).`);
              return false;
          }

          // 🚨 Bloquear lunes y martes de la próxima semana si hoy es martes o más adelante
          if ((deliveryDayOfWeek === 1 || deliveryDayOfWeek === 2) && today.getDay() >= 2) {
              console.warn(`🚫 Pedido bloqueado: No se puede hacer pedidos para la próxima semana (${deliveryDate.toDateString()}).`);
              return false;
          }

          return true; // ✅ Fecha válida
      })
  );
}


    ngOnInit() {
      if (this.locations.length === 0) {
        this.locations = [{
          dir: 'Dirección de prueba', isDefault: true,
          id: 0
        }];
      }
    }
        

  placeOrder() {
      this.makeLoadingAnimation();
      this.doRequest();
  }

  doRequest() {
    this.ordersService.PlaceOrder(this.orders).subscribe( response => {
      this.response = response as ResponseObject
      console.log(this.response);
      if(this.response.statusCode === 200) {
        this.closeLoader();
        this.alertTool.presentToast("Orden enviada con éxito!");
        this.makeOrderEvent.emit();
      } else {
        this.closeLoader();
        this.alertTool.presentToast(this.response.message);
      }
    }, error => {
      if(error) {
        this.closeLoader();
        this.alertTool.presentToast("Oops... Ocurrió un error!");  
      }
    })
  }



  handleSelectionDir(event: any) {
    this.selectedLocation = event.detail.value;
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
