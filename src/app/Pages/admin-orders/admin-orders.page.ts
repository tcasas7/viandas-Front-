import { DateSelector } from './../../Models/DateSelector';
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ClientOrder } from 'src/app/Models/ClientOrder';
import { OrderDTO } from 'src/app/Models/OrderDTO';
import { ResponseObjectList } from 'src/app/Models/Response/ResponseObjList';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { UserDTO } from 'src/app/Models/UserDTO';
import { OrdersService } from 'src/app/Services/OrdersService/orders.service';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.page.html',
  styleUrls: ['./admin-orders.page.scss'],
})
export class AdminOrdersPage implements OnInit{

  dataResponse: ResponseObjectModel<UserDTO> = new ResponseObjectModel();
  ordersResponse: ResponseObjectModel<Array<OrderDTO>> = new ResponseObjectModel();
  datesResponse: ResponseObjectList<Array<Date>> = new ResponseObjectList();
  toDisplayOrders: Array<ClientOrder> = new Array<ClientOrder>();
  formatedStringDates: Array<string> = new Array<string>();
  dates: Array<DateSelector> = new Array<DateSelector>();
  user!: UserDTO;
  orders!: Array<OrderDTO>;
  isAdmin: boolean = false;
  logged: boolean = false;
  activeModal: number = 0;
  showHiddenOrders: boolean = false;
  filteredOrders: Array<ClientOrder> = new Array<ClientOrder>();
  filterDate: string = '';
  showFilter: boolean = false;
  pastOrdersHidden: boolean = false;

  constructor(
    private router: Router,
    private userService: UsersService,
    private ordersService: OrdersService,
    private alertTool: AlertTool,
    private loadingCtrl: LoadingController
    
  ) {}

  ngOnInit() {
    this.getOrders(); // Cargar las órdenes al iniciar
}

  navigateToAdmin() {
    this.router.navigate(["admin"]);
  }

  ionViewWillEnter() {
    this.makeLoadingAnimation();
    this.logged = localStorage.getItem("Logged") === "true";

    if (!this.logged) {
      this.router.navigate(["/unauthorized"]);
    } else {
      this.getData(); 
    }
  }

  async getData() {
    this.userService.GetData().subscribe(
      (response) => {
        this.dataResponse = response as ResponseObjectModel<UserDTO>;
        this.user = this.dataResponse.model;
        localStorage.setItem("firstName", this.user.firstName);
        localStorage.setItem("lastName", this.user.lastName);
        this.saveRole(this.user.role);
        this.getOrders();
        this.getDates();
        this.closeLoader();
      },
      (error) => {
        this.closeLoader();
        this.router.navigate(["/unauthorized"]);
        this.alertTool.presentToast("Oops... Ocurrió un error!");
      }
    );
  }

  async getOrders() {
    if (this.isAdmin) {
      // Si es administrador, obtiene todas las órdenes
      this.ordersService.GetAll().subscribe(
        (response) => {
          this.ordersResponse = response as ResponseObjectModel<Array<OrderDTO>>;
          this.orders = this.ordersResponse.model;
          this.formatOrders();
          this.filteredOrders = [...this.toDisplayOrders];
        },
        (error) => {
          this.router.navigate(["/unauthorized"]);
          this.alertTool.presentToast("Oops... Ocurrió un error al obtener las órdenes!");
        }
      );
    } else {
      // Si no es administrador, obtiene solo las órdenes propias
      this.ordersService.GetOwn().subscribe(
        (response) => {
          this.ordersResponse = response as ResponseObjectModel<Array<OrderDTO>>;
          this.orders = this.ordersResponse.model;
          this.formatOrders();
        },
        (error) => {
          this.router.navigate(["/unauthorized"]);
          this.alertTool.presentToast("Oops... Ocurrió un error al obtener las órdenes!");
        }
      );
    }
  } 
  
  async getDates() {
    this.ordersService.getDates().subscribe(
      (response) => {
        this.datesResponse = response as ResponseObjectList<Array<Date>>;
        this.mapDates(this.datesResponse.model);
        this.makeStringDates();
        this.showDates();
      },
      (error) => {
        this.router.navigate(["/unauthorized"]);
        this.alertTool.presentToast("Oops... Ocurrió un error!");
      }
    );
  }

  saveRole(role: number) {
    if (role === 0) {
      localStorage.setItem("role", "CLIENT");
    } else if (role === 1) {
      localStorage.setItem("role", "DELIVERY");
    } else if (role === 2) {
      localStorage.setItem("role", "ADMIN");
      this.isAdmin = true;
    }
  }

  makeLoadingAnimation() {
    this.loadingCtrl.getTop().then((hasLoading) => {
      if (!hasLoading) {
        this.loadingCtrl.create({
          spinner: 'circular',
          cssClass: "custom-loading"
        }).then((loading) => loading.present());
      }
    });
  }

  async closeLoader() {
    this.checkAndCloseLoader();
    setTimeout(() => this.checkAndCloseLoader(), 500);
  }

  async checkAndCloseLoader() {
    const loader = await this.loadingCtrl.getTop();
    if (loader !== undefined) { 
      await this.loadingCtrl.dismiss();
    }
  }

  getDayNumber(date: Date): number {
    const day = new Date(date).getDay();
    return day === 0 || day === 6 ? -1 : day; // Si es sábado o domingo, devolver -1 (nunca debería pasar)
  }
  
  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
  
  formatOrders() {
    let hiddenOrders = JSON.parse(localStorage.getItem("hiddenOrders_admin") || "[]");

    this.toDisplayOrders = this.orders
      .map(order => {
        const clientOrder = new ClientOrder(order);

        clientOrder.clientEmail = order.clientEmail || "No disponible";
        clientOrder.clientPhone = order.clientPhone || "No disponible";
        clientOrder.totalPlates = order.deliveries?.reduce((sum, delivery) => sum + (delivery.quantity || 0), 0) || 0;

        return clientOrder;
      })
      .filter(order => this.showHiddenOrders || !hiddenOrders.includes(order.id));

      this.toDisplayOrders.sort((a, b) => b.id - a.id);

      this.filteredOrders = [...this.toDisplayOrders];

    //console.log("📌 Órdenes visibles (Admin):", this.toDisplayOrders);
}


filterOrders() {
  if (!this.filterDate) {
      this.filteredOrders = [...this.toDisplayOrders]; // 🔹 Mostrar todo si no hay filtro
      return;
  }

  const selectedDate = new Date(this.filterDate).toISOString().split('T')[0];

  this.filteredOrders = this.orders
      .filter(order =>
          order.deliveries.some(delivery =>
              new Date(delivery.deliveryDate).toISOString().split('T')[0] === selectedDate
          )
      )
      .map(order => {
          const clientOrder = new ClientOrder(order);
          clientOrder.totalPlates = clientOrder.deliveries.reduce((sum, delivery) => sum + (delivery.quantity || 0), 0);
          return clientOrder;
      });

      this.filteredOrders.sort((a, b) => b.id - a.id);      

  //console.log("📌 Órdenes filtradas:", this.filteredOrders);
}


  resetFilter() {
    this.filterDate = '';
    this.filteredOrders = [...this.toDisplayOrders];
  }


async hideOrder(orderId: number) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Confirmar ocultación';
    alert.message = '¿Estás seguro de que deseas ocultar esta orden en Admin?';
    alert.buttons = [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Ocultar',
        handler: () => {
          let hiddenOrders = JSON.parse(localStorage.getItem("hiddenOrders_admin") || "[]");
          
          if (!hiddenOrders.includes(orderId)) {
            hiddenOrders.push(orderId);
            localStorage.setItem("hiddenOrders_admin", JSON.stringify(hiddenOrders));
          }

          this.getOrders(); // 🔄 Recargar lista
        }
      }
    ];

    document.body.appendChild(alert);
    return alert.present();
}

  toggleHiddenOrders() {
    this.showHiddenOrders = !this.showHiddenOrders;
    this.formatOrders();
  }

  toggleOrderCollapse(order: any) {
  order.isCollapsed = !order.isCollapsed;
}


  collapseOrder(order: ClientOrder) {
    order.isCollapsed = true;
  }

  uncollapseOrder(order: ClientOrder) {
    order.isCollapsed = false;
  }

  mapDates(array: Array<any>) {
    this.dates = array.map(d => {
      let dateSelector = new DateSelector();
      dateSelector.date = new Date(d);
      return dateSelector;
    });
  }

  makeStringDates() {
    this.dates.forEach(element => {
      let day: string;
      const dayMapping = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      day = dayMapping[element.date.getDay()];
      element.stringDate = `${day}: ${element.date.getDate()}/${element.date.getMonth()}/${element.date.getFullYear()}`;
    });
  }

  showDates() {
    //this.dates.forEach(element => console.log(element));
  }

  loadOrders(): void {
    this.ordersService?.GetOwn().subscribe(
      (response) => {
        if (response?.status === 200) {
          this.toDisplayOrders = response.data.map((order: OrderDTO) => new ClientOrder(order));
          //.log('Órdenes cargadas:', this.toDisplayOrders);
        } else {
          //console.error('Error al cargar órdenes:', response?.message);
        }
      },
      (error) => {
        //console.error('Error al cargar órdenes:', error);
      }
    );
  }
  
  toggleFilter() {
    this.showFilter = !this.showFilter; 
  }
  confirmOrder(orderId: number): void {
    this.alertTool.presentToast("Funcionalidad en desarrollo");
  }

  async hidePastOrders() {
    const alert = document.createElement('ion-alert');
    alert.header = this.pastOrdersHidden ? 'Mostrar órdenes viejas' : 'Confirmar limpieza';
    alert.message = this.pastOrdersHidden 
      ? '¿Quieres volver a mostrar las órdenes viejas?' 
      : '¿Seguro que quieres limpiar las órdenes viejas? Podrás mostrarlas nuevamente si lo deseas.';
    
    alert.buttons = [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: this.pastOrdersHidden ? 'Mostrar' : 'Limpiar',
        handler: () => {
          if (this.pastOrdersHidden) {
            // 🔹 Mostrar todas las órdenes otra vez
            this.filteredOrders = this.orders.map(order => {
              const clientOrder = new ClientOrder(order);
              clientOrder.totalPlates = clientOrder.deliveries.reduce((sum, delivery) => sum + (delivery.quantity || 0), 0);
              return clientOrder;
            });
            this.pastOrdersHidden = false;
          } else {
            // 🔹 Ocultar órdenes viejas
            const today = new Date().toISOString().split('T')[0];

            this.filteredOrders = this.orders
              .filter(order =>
                order.deliveries.some(delivery =>
                  new Date(delivery.deliveryDate).toISOString().split('T')[0] >= today
                )
              )
              .map(order => {
                const clientOrder = new ClientOrder(order);
                clientOrder.totalPlates = clientOrder.deliveries.reduce((sum, delivery) => sum + (delivery.quantity || 0), 0);
                return clientOrder;
              });

            this.pastOrdersHidden = true;
          }
        }
      }
    ];

    document.body.appendChild(alert);
    return alert.present();
}

  
  openCalendarModal() {
    this.activeModal = 1;
  }

  closeModal() {
    this.activeModal = 0;
  }

  copyOrderSummary(order: any) {
    const formattedDate = new Date(order.orderDate).toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  
    const summary = `
    Resumen de la orden - ${formattedDate}
    Descripción: ${order.description || 'Sin descripción'}
    Método de pago: ${order.paymentMethod === 0 ? 'Efectivo' : 'Transferencia'}
    Cantidad de Platos: ${order.totalPlates ?? 'No disponible'}
    Cliente: ${order.clientEmail}
    Teléfono: ${order.clientPhone}
    Dirección: ${order.location}
    Total: $${order.price ?? 'No disponible'}
    `;
  
    navigator.clipboard.writeText(summary.trim()).then(() => {
      this.alertTool.presentToast("📋 Resumen copiado al portapapeles");
    }).catch(err => {
      this.alertTool.presentToast("⚠️ Error al copiar el resumen");
    });
  }
  

}
