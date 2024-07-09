import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ClientOrder } from 'src/app/Models/ClientOrder';
import { OrderDTO } from 'src/app/Models/OrderDTO';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { UserDTO } from 'src/app/Models/UserDTO';
import { OrdersService } from 'src/app/Services/OrdersService/orders.service';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage {

  dataResponse: ResponseObjectModel<UserDTO> = new ResponseObjectModel();
  ordersResponse: ResponseObjectModel<Array<OrderDTO>> = new ResponseObjectModel();

  user!: UserDTO;
  orders!: Array<OrderDTO>;
  toDisplayOrders: Array<ClientOrder> = new Array<ClientOrder>() ;

  isAdmin: boolean = false;
  didLoad: boolean = false;
  logged: boolean = false;
  paymentInfoModalIsActive: boolean = false;

  constructor(
    private router: Router,
    private userService: UsersService,
    private ordersService: OrdersService,
    private alertTool: AlertTool,
    private loadingCtrl: LoadingController
  ) { }

  navigateToProfile() {
    this.router.navigate(['/profile']);
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
  
      this.didLoad = true;
      this.getOrders();
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
      this.didLoad = true;
      this.formatOrders();
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

openPaymentInfoModal() {
  this.paymentInfoModalIsActive = true;
}

closePaymentInfoModal() {
  this.paymentInfoModalIsActive = false;
}
}
