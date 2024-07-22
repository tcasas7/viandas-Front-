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

  toDisplayOrders: Array<any> = new Array<any>();

  formatedStringDates: Array<string> = new Array<string>();

  dates: Array<DateSelector> 

  user!: UserDTO;
  orders!: Array<OrderDTO>;

  isAdmin: boolean = false;
  logged: boolean = false;

  activeModal: number = 0;

  constructor(private router: Router,
    private userService: UsersService,
    private ordersService: OrdersService,
    private alertTool: AlertTool,
    private loadingCtrl: LoadingController)
    {
      this.dates = new Array<DateSelector>();
    }

  navigateToAdmin() {
    this.router.navigate(["admin"]);
  }

  ionViewWillEnter() {
    this.makeLoadingAnimation();
    if(localStorage.getItem("Logged") === "true") {
      this.logged = true;
    }
    else {
      this.logged = false;
    }

    if(!this.logged) {
      this.router.navigate(["/unauthorized"]);
    }

    this.getData(); 
  }

  async getData() {
    this.userService.GetData().subscribe( response => {
      this.dataResponse = response as ResponseObjectModel<UserDTO>;
      this.user = this.dataResponse.model;
      localStorage.setItem("firstName", this.dataResponse.model.firstName);
      localStorage.setItem("lastName", this.dataResponse.model.lastName);
      this.saveRole(this.dataResponse.model.role);
  
      this.getOrders();
      this.getDates();
      this.closeLoader();
    }, error => {
      this.closeLoader();
      this.router.navigate(["/unauthorized"]);
      this.alertTool.presentToast("Oops... Ocurrió un error!");
    });
  }

  async getOrders() {
    this.ordersService.GetOwn().subscribe( response => {
      this.ordersResponse = response as ResponseObjectModel<Array<OrderDTO>>;
      this.orders = this.ordersResponse.model;
      this.formatOrders();
    }, error => {
      this.router.navigate(["/unauthorized"]);
      this.alertTool.presentToast("Oops... Ocurrió un error!");
    });
  }

  async getDates() {
    this.ordersService.getDates().subscribe( response => {
      this.datesResponse = response as ResponseObjectList<Array<Date>>;
      this.mapDates(this.datesResponse.model);
      this.makeStringDates();
      this.showDates();
    }, error => {
      this.router.navigate(["/unauthorized"]);
      this.alertTool.presentToast("Oops... Ocurrió un error!");
    });
  }

  saveRole(role: number) {
    if(role === 0) {
      localStorage.setItem("role", "CLIENT");
    } else if( role === 1) {
      localStorage.setItem("role", "DELIVERY");
    } else if( role === 2) {
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
}

formatOrders() {
  this.toDisplayOrders = new Array<ClientOrder>();
  this.orders.forEach(o => {
    var order = new ClientOrder(o);
    this.toDisplayOrders.push(order);
  });
}

collapseOrder(order: ClientOrder) {
  order.isCollapsed = true;
}

uncollapseOrder(order: ClientOrder) {
  order.isCollapsed = false;
}

mapDates(array: Array<any>) {
  array.forEach(d => {

    var dateSelector = new DateSelector();
    dateSelector.date = new Date(d);
    this.dates.push(dateSelector);
  });
}

makeStringDates() {
  this.dates.forEach(element => {
    var day;
    if(element.date.getDay() == 1) {
      day = 'Lunes';
    } else if(element.date.getDay() == 2) {
      day = 'Martes';
    } else if(element.date.getDay() == 3) {
      day = 'Miércoles';
    }
    else if(element.date.getDay() == 4) {
      day = 'Jueves';
    }
    else if(element.date.getDay() == 5) {
      day = 'Viernes';
    }
    else if(element.date.getDay() == 6) {
      day = 'Sábado';
    }
    else if(element.date.getDay() == 0) {
      day = 'Domingo';
    }

    element.stringDate = day + ": " + element.date.getDate().toString() + "/" + element.date.getMonth().toString() + "/" + element.date.getFullYear().toString();
  });
}

showDates() {
  this.dates.forEach(element => {
    console.log(element);
  });
}

openCalendarModal() {
  this.activeModal = 1;
}

closeModal() {
  this.activeModal = 0;
}

}