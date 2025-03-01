import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ClientOrder } from 'src/app/Models/ClientOrder';
import { ContactDTO } from 'src/app/Models/ContactDTO';
import { OrderDTO } from 'src/app/Models/OrderDTO';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { UserDTO } from 'src/app/Models/UserDTO';
import { OrdersService } from 'src/app/Services/OrdersService/orders.service';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';
import { HttpClient } from '@angular/common/http';
import { ToDisplayOrderDTO } from 'src/app/Models/ToDisplayOrderDTO';
import { DayOfWeek } from 'src/app/Models/Enums/DayOfWeekEnums';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage {
  private baseUrl = 'http://localhost:5009/api/Orders';
  dataResponse: ResponseObjectModel<UserDTO> = new ResponseObjectModel();
  ordersResponse: ResponseObjectModel<Array<OrderDTO>> = new ResponseObjectModel();
  contactResponse: ResponseObjectModel<ContactDTO> = new ResponseObjectModel();

  user!: UserDTO;
  orders: Array<OrderDTO> = [];
  contact: ContactDTO = new ContactDTO();
  toDisplayOrders: Array<ClientOrder> = [];
  isAdmin = false;
  logged = false;
  paymentInfoModalIsActive = false;
  toPayTotal = 0;
  showHiddenOrders: boolean = false;
  filteredOrders: Array<ClientOrder> = [];
  filterDate: string = '';
  pastOrdersHidden: boolean = false;
  showFilter: boolean = false;
  expandedOrders: { [orderId: number]: boolean } = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UsersService,
    private ordersService: OrdersService,
    private alertTool: AlertTool,
    private loadingCtrl: LoadingController
  ) {}

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  ionViewWillEnter() {
    this.makeLoadingAnimation();
    this.logged = localStorage.getItem("Logged") === "true";

    if (!this.logged) {
      this.router.navigate(['/unauthorized']);
    } else {
      this.getData();
    }
  }

  async getData() {
    this.userService.GetData().subscribe(
      response => {
        this.dataResponse = response as ResponseObjectModel<UserDTO>;
        this.user = this.dataResponse.model;
        localStorage.setItem("firstName", this.user.firstName);
        localStorage.setItem("lastName", this.user.lastName);
        this.saveRole(this.user.role);

        this.getOrders();
        this.getActiveContact();
        this.closeLoader();
      },
      error => {
        this.closeLoader();
        this.router.navigate(['/unauthorized']);
        this.alertTool.presentToast("Oops... Ocurrió un error!");
      }
    );
  }

  async getOrders() {
    this.ordersService.GetOwn().subscribe(
      response => {
        this.ordersResponse = response as ResponseObjectModel<Array<OrderDTO>>;
        this.orders = this.ordersResponse.model;

        let hiddenOrders = JSON.parse(localStorage.getItem("hiddenOrders_client") || "[]");

        this.toDisplayOrders = this.orders
          .filter(order => !hiddenOrders.includes(order.id))
          .map(order => new ClientOrder(order));

        this.formatOrders();
      },
      error => {
        this.router.navigate(['/unauthorized']);
        this.alertTool.presentToast("Oops... Ocurrió un error!");
      }
    );
  }

  async getActiveContact() {
    this.userService.GetActiveContact().subscribe(
      response => {
        this.contactResponse = response as ResponseObjectModel<ContactDTO>;
        this.contact = this.contactResponse.model;
      },
      error => {
        this.router.navigate(['/unauthorized']);
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
    this.loadingCtrl.getTop().then(hasLoading => {
      if (!hasLoading) {
        this.loadingCtrl.create({
          spinner: 'circular',
          cssClass: "custom-loading"
        }).then(loading => loading.present());
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


  formatOrders() {
    this.toDisplayOrders = [];
    const hiddenOrders: number[] = JSON.parse(localStorage.getItem("hiddenOrders_client") || "[]");
  
    this.orders.forEach(order => {
      let consolidatedOrder = new ClientOrder(order);
      consolidatedOrder.totalPlates = 0;
      consolidatedOrder.daysOfWeek = [];
      consolidatedOrder.menuCounts = { estandar: 0, light: 0, proteico: 0 };
      consolidatedOrder.groupedDeliveries = {};
  
      order.deliveries.forEach(delivery => {
        const deliveryDate = new Date(delivery.deliveryDate).toLocaleDateString("es-ES");
  
        if (!consolidatedOrder.groupedDeliveries[deliveryDate]) {
          consolidatedOrder.groupedDeliveries[deliveryDate] = [];
        }
  
        let type = "Desconocido";
        if (delivery.menuId === 1) {
          type = "Estandar";
          consolidatedOrder.menuCounts.estandar += delivery.quantity;
        } else if (delivery.menuId === 2) {
          type = "Light";
          consolidatedOrder.menuCounts.light += delivery.quantity;
        } else if (delivery.menuId === 3) {
          type = "Proteico";
          consolidatedOrder.menuCounts.proteico += delivery.quantity;
        }
  
        consolidatedOrder.groupedDeliveries[deliveryDate].push({ type, quantity: delivery.quantity });
        consolidatedOrder.totalPlates += delivery.quantity;
      });
  
      consolidatedOrder.price = order.price;
  
      if (this.showHiddenOrders || !hiddenOrders.includes(order.id)) {
        this.toDisplayOrders.push(consolidatedOrder);
      }
    });
  
    this.toDisplayOrders.sort((a, b) => b.id - a.id);

    this.toDisplayOrders.reverse();
  
    this.filteredOrders = [...this.toDisplayOrders]; 
  }
  
  filterOrders() {
    if (!this.filterDate) {
      this.filteredOrders = [...this.toDisplayOrders]; 
      return;
    }
  
    const selectedDate = new Date(this.filterDate).toISOString().split('T')[0];
  
    this.filteredOrders = this.toDisplayOrders
      .filter(order =>
        order.deliveries.some(delivery =>
          new Date(delivery.deliveryDate).toISOString().split('T')[0] === selectedDate
        )
      );      
  }
  
  
  
  resetFilter() {
    this.filterDate = '';
    this.filteredOrders = [...this.toDisplayOrders];
  }

 
  async hidePastOrders() {
    const alert = document.createElement('ion-alert');
    alert.header = this.pastOrdersHidden ? 'Mostrar órdenes viejas' : 'Confirmar limpieza';
    alert.message = this.pastOrdersHidden 
      ? '¿Quieres volver a mostrar las órdenes viejas?' 
      : '¿Seguro que quieres limpiar las órdenes viejas?';

    alert.buttons = [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: this.pastOrdersHidden ? 'Mostrar' : 'Limpiar',
        handler: () => {
          if (this.pastOrdersHidden) {
            this.filteredOrders = [...this.toDisplayOrders];
            this.pastOrdersHidden = false;
          } else {
            const today = new Date().toISOString().split('T')[0];

            this.filteredOrders = this.toDisplayOrders.filter(order =>
              order.deliveries.some(delivery =>
                new Date(delivery.deliveryDate).toISOString().split('T')[0] >= today
              )
            );

            this.pastOrdersHidden = true;
          }
        }
      }
    ];

    document.body.appendChild(alert);
    return alert.present();
  }
  
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }
  
  toggleOrder(orderId: number) {
    this.expandedOrders[orderId] = !this.expandedOrders[orderId];
  }

  // Función auxiliar para obtener el tipo de menú según el ID
  getMenuType(menuId: number): string {
    const menuTypes: { [key: number]: string } = {
      1: 'Estandar',
      2: 'Light',
      3: 'Proteico'
    };
    return menuTypes[menuId] || 'Desconocido';
  }
  
  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
  

  getDayName(date: any): string {
    if (typeof date === 'string') {
      date = new Date(date); // Convertir el string a Date
    }
  
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error("❌ Error: Fecha inválida", date);
      return "Fecha inválida"; 
    }
  
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return days[date.getDay()];
  }
  
  isLastItem(array: any[], item: any): boolean {
    return array.indexOf(item) === array.length - 1;
  }
  
  
  collapseOrder(order: ClientOrder) {
    order.isCollapsed = true;
  }

  uncollapseOrder(order: ClientOrder) {
    order.isCollapsed = false;
  }

  openPaymentInfoModal(order: ClientOrder) {
    this.toPayTotal = order.price;

    this.userService.GetActiveContact().subscribe(
      response => {
        this.contactResponse = response as ResponseObjectModel<ContactDTO>;
        this.contact = this.contactResponse.model;
        
        console.log("📌 Modal activado con datos:", this.contact); // Debugging
        
        this.paymentInfoModalIsActive = true; // Activamos el modal
      },
      error => {
        this.alertTool.presentToast("Error al cargar la información de pago");
      }
    );
}

  loadOrders(): void {
    this.ordersService.GetOwn().subscribe(
      response => {
        if (response.status === 200) {
          this.toDisplayOrders = response.data;
          console.log('Órdenes cargadas:', this.toDisplayOrders);
        } else {
          console.error('Error al cargar órdenes:', response.message);
        }
      },
      error => {
        console.error('Error al cargar órdenes:', error);
      }
    );
  }

  viewProducts(orderId: number) {
    this.ordersService.GetProductsByOrderId(orderId).subscribe(
      products => {
        console.log(products);
      },
      error => {
        this.alertTool.presentToast('Error al obtener los productos de la orden.');
      }
    );
  }

  closePaymentInfoModal() {
    this.paymentInfoModalIsActive = false;
    console.log("📌 Modal cerrado"); // Debugging
}

}
