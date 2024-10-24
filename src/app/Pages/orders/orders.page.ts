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
  orders!: Array<OrderDTO>;
  contact: ContactDTO;
  toDisplayOrders: Array<ClientOrder> = new Array<ClientOrder>() ;

  isAdmin: boolean = false;
  logged: boolean = false;
  paymentInfoModalIsActive: boolean = false;

  toPayTotal: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UsersService,
    private ordersService: OrdersService,
    private alertTool: AlertTool,
    private loadingCtrl: LoadingController
  )
  {
    
    this.contact = new ContactDTO();
  }

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
  
      this.getOrders();
      this.getActiveContact();
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

  async getActiveContact() {
    this.userService.GetActiveContact().subscribe( response => {
      this.contactResponse = response as ResponseObjectModel<ContactDTO>;
      this.contact = this.contactResponse.model;
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
  console.log('Órdenes a mostrar:', this.toDisplayOrders); // <-- Asegúrate de que aquí se muestren las órdenes
}


collapseOrder(order: ClientOrder) {
  order.isCollapsed = true;
}

uncollapseOrder(order: ClientOrder) {
  order.isCollapsed = false;
}

openPaymentInfoModal(order: ClientOrder) {
  this.toPayTotal = order.price;

  // Obtener la información del contacto activo
  this.userService.GetActiveContact().subscribe(response => {
    this.contactResponse = response as ResponseObjectModel<ContactDTO>;
    this.contact = this.contactResponse.model;

    // Activar el modal
    this.paymentInfoModalIsActive = true;
  }, error => {
    this.alertTool.presentToast("Error al cargar la información de pago");
  });
}


cancelOrder(orderId: number) {
  this.alertTool.presentToast("Funcionalidad en desarrollo");
}


loadOrders(): void {
  this.ordersService.GetOwn().subscribe(
    (response) => {
      if (response.status === 200) {
        this.toDisplayOrders = response.data;
        console.log('Órdenes cargadas:', this.toDisplayOrders);
      } else {
        console.error('Error al cargar órdenes:', response.message);
      }
    },
    (error) => {
      console.error('Error al cargar órdenes:', error);
    }
  );
}


viewProducts(orderId: number) {
  this.ordersService.GetProductsByOrderId(orderId).subscribe(
    (products: any) => { 
      console.log(products);
    },
    (error: any) => {
      this.alertTool.presentToast('Error al obtener los productos de la orden.');
    }
  );
}
closePaymentInfoModal() {
  this.paymentInfoModalIsActive = false;
}
}
