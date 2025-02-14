import { DateSelector } from './../../Models/DateSelector';
import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
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
export class AdminOrdersPage {

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

  constructor(
    private router: Router,
    private userService: UsersService,
    private ordersService: OrdersService,
    private alertTool: AlertTool,
    private loadingCtrl: LoadingController
    
  ) {}

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
    let hiddenOrders = JSON.parse(localStorage.getItem("hiddenOrders") || "[]");
  
    this.toDisplayOrders = this.orders
      .map(order => {
        const clientOrder = new ClientOrder(order);
  
        // ✅ Calcular total de platos correctamente
        clientOrder.totalPlates = order.deliveries?.reduce((sum, delivery) => sum + (delivery.quantity || 0), 0) || 0;
  
        return clientOrder;
      })
      .filter(order => !hiddenOrders.includes(order.id)); // ❌ Ocultar las órdenes guardadas
  
    console.log("📌 Órdenes visibles:", this.toDisplayOrders);
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
    this.dates.forEach(element => console.log(element));
  }

  loadOrders(): void {
    this.ordersService?.GetOwn().subscribe(
      (response) => {
        if (response?.status === 200) {
          this.toDisplayOrders = response.data.map((order: OrderDTO) => new ClientOrder(order));
          console.log('Órdenes cargadas:', this.toDisplayOrders);
        } else {
          console.error('Error al cargar órdenes:', response?.message);
        }
      },
      (error) => {
        console.error('Error al cargar órdenes:', error);
      }
    );
  }
  
  async hideOrder(orderId: number) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Confirmar ocultación';
    alert.message = '¿Estás seguro de que deseas ocultar esta orden?';
    alert.buttons = [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Ocultar',
        handler: () => {
          let hiddenOrders = JSON.parse(localStorage.getItem("hiddenOrders") || "[]");
          hiddenOrders.push(orderId);
          localStorage.setItem("hiddenOrders", JSON.stringify(hiddenOrders));
          this.getOrders(); // 🔄 Recargar lista
        }
      }
    ];
  
    document.body.appendChild(alert);
    return alert.present();
  }
  
  confirmOrder(orderId: number): void {
    this.alertTool.presentToast("Funcionalidad en desarrollo");
  }
  
  openCalendarModal() {
    this.activeModal = 1;
  }

  closeModal() {
    this.activeModal = 0;
  }
}
