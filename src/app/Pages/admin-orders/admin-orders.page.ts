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
    this.ordersService.GetOwn().subscribe(
      (response) => {
        this.ordersResponse = response as ResponseObjectModel<Array<OrderDTO>>;
        this.orders = this.ordersResponse.model;
        this.formatOrders();
      },
      (error) => {
        this.router.navigate(["/unauthorized"]);
        this.alertTool.presentToast("Oops... Ocurrió un error!");
      }
    );
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

  formatOrders() {
    this.toDisplayOrders = this.orders.map(order => new ClientOrder(order));
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
  
  cancelOrder(orderId: number): void {
    this.alertTool.presentToast("Funcionalidad en desarrollo");
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
