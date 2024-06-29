import { OrderDTO } from 'src/app/Models/OrderDTO';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { CartItem } from 'src/app/Models/CartItem';
import { MenuDTO } from 'src/app/Models/MenuDTO';
import { PlaceOrderDTO } from 'src/app/Models/PlaceOrderDTO';
import { ResponseObjectList } from 'src/app/Models/Response/ResponseObjList';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { UserDTO } from 'src/app/Models/UserDTO';
import { MenusService } from 'src/app/Services/MenusService/menus.service';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';
import { DeliveryDTO } from 'src/app/Models/DeliveryDTO';
import { ProductDTO } from 'src/app/Models/ProductDTO';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  dataResponse: ResponseObjectModel<UserDTO> = new ResponseObjectModel();

  logged: boolean = false;

  showLoginModal: boolean = false;
  showRegisterModal: boolean = false;
  showChangePasswordModal: boolean = false;
  showOrderResumeModal: boolean = false;

  carouselItems: CartItem[];
  carouselSets: any[][] = [];
  currentIndex = 0;
  itemsPerSlide = 3;
  daysOfWeek: any[] = [
    { "day": 'Lunes', "class": 'monday'},
    { "day": 'Martes', "class": 'tuesday'},
    { "day": 'Miercoles', "class": 'wednesday'},
    { "day": 'Jueves', "class": 'thursday'},
    { "day": 'Viernes', "class": 'friday'}
  ];
  icon: string = "cart-outline";

  leftHiden: boolean = false;
  rightHiden: boolean = true;

  actualDayNumber = 1;
  actualDayName: any;

  totalUnits: number = 0;

  modalOpened: boolean = false;

  isDesktop!: boolean;

  profileImageUrl: any;

  message!: ResponseObjectList<MenuDTO>;

  menus: MenuDTO[];

  standardItems: CartItem[];
  lightItems: CartItem[];
  proteicItems: CartItem[];

  orders: PlaceOrderDTO = new PlaceOrderDTO();

  orderMonday: OrderDTO = new OrderDTO();
  orderTuesday: OrderDTO = new OrderDTO();
  orderWednesday: OrderDTO = new OrderDTO();
  orderThursday: OrderDTO = new OrderDTO();
  orderFriday: OrderDTO = new OrderDTO();

  constructor(
    private alertTool: AlertTool,
    private router: Router,
    private platform: Platform, 
    private sanitizer: DomSanitizer, 
    private menuService: MenusService,
    private cdr: ChangeDetectorRef,
    private userService: UsersService,
    private loadingCtrl: LoadingController
  ) {
    this.menus = new Array<MenuDTO>();
    this.standardItems = new Array<CartItem>();
    this.lightItems = new Array<CartItem>();
    this.proteicItems = new Array<CartItem>();
    this.carouselItems = new Array<CartItem>();

    this.initializeApp();

    this.orders.orders = new Array<OrderDTO>();

    this.orderMonday.deliveries = new Array<DeliveryDTO>();
    this.orderTuesday.deliveries = new Array<DeliveryDTO>();
    this.orderWednesday.deliveries = new Array<DeliveryDTO>();
    this.orderThursday.deliveries = new Array<DeliveryDTO>();
    this.orderFriday.deliveries = new Array<DeliveryDTO>();

    this.orders.orders.push(this.orderMonday);
    this.orders.orders.push(this.orderTuesday);
    this.orders.orders.push(this.orderWednesday);
    this.orders.orders.push(this.orderThursday);
    this.orders.orders.push(this.orderFriday);

    this.actualDayName = this.daysOfWeek[this.currentIndex].day;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.isDesktop = this.platform.is('desktop');
    });
  }

  async instanceItems() {
    try {
      const response = await this.menuService.GetAll().toPromise();
      this.message = response as ResponseObjectList<MenuDTO>;
      this.menus = this.message.model;

      await this.formatToCartItems();
      this.initializeCarouselSets();
      this.closeLoader();
    } catch (error) {
      this.closeLoader();
      this.alertTool.presentToast("Oops... Ocurrió un error");
      console.error('Error fetching data:', error);
    }
  }

  ionViewWillEnter() {
    if(localStorage.getItem("Logged") === "true") {
      this.logged = true;
    } else {
      this.logged = false;
    }

    this.makeLoadingAnimation();

    if(this.logged) {
      this.userService.GetData().subscribe( response => {
        this.dataResponse = response as ResponseObjectModel<UserDTO>;

        localStorage.setItem("firstName", this.dataResponse.model.firstName);
        localStorage.setItem("lastName", this.dataResponse.model.lastName);
        this.saveRole(this.dataResponse.model.role);
      }, error => {
        localStorage.clear();
        this.logged = false;
      });
    }
    this.instanceItems();
  }

  initializeCarouselSets() {
    for (let i = 0; i < this.carouselItems.length; i += this.itemsPerSlide) {
      this.carouselSets.push(this.carouselItems.slice(i, i + this.itemsPerSlide));
    }
  }

  updateCarousel() {
    const carouselContent = document.querySelector('.carousel-content') as HTMLElement;
    const setWidth = 77; // Ancho del set + margen derecho
    const translateX = -this.currentIndex * setWidth;
    carouselContent.style.transform = `translateX(${translateX}vw)`;
    this.actualDayName = this.daysOfWeek[this.currentIndex].day;

    if(this.currentIndex == 0) {
      this.leftHiden = false;
    } else if(this.currentIndex == 4) {
      this.rightHiden = false;
    } else {
      this.leftHiden = true;
      this.rightHiden = true;
    }
  }

  next() {
    if (this.currentIndex < this.carouselSets.length - 1) {
      this.currentIndex++;
      this.actualDayNumber++;
      this.updateCarousel();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.actualDayNumber--;
      this.updateCarousel();
    }
  }

  addToCart(item: CartItem) {
    item.total++;
    this.totalUnits++;
    this.modifyItemInOrders(item);
  }

  modifyItemInOrders(item: CartItem) {
    for (const order of this.orders.orders) {
      for (const deliv of order.deliveries) {
        if(deliv.productId === item.id) {
          deliv.quantity = item.total;
        }
      }
    }
  }

  removeFromCart(item: CartItem) {
    if(item.total <= 1)
      item.cartPressed = false;

    item.total--;
    this.totalUnits--;
    this.modifyItemInOrders(item);
  }

  pressCart(item: CartItem) {
    item.cartPressed = true;
    this.addToCart(item);
  }

  navigateToProfile() {
    this.router.navigate(["/profile"]);
  }

  navigateToLogin() {
    this.showLoginModal = true;
  }

  navigateToRegister() {
    this.showRegisterModal = true;
    this.closeChangePasswordModal();
    this.closeLoginModal();
  }

  navigateToChangePassword() {
    this.showChangePasswordModal = true;
    this.closeRegisterModal();
    this.closeLoginModal();
  }

  navigateToOrderResume() {
    this.showOrderResumeModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
    if(localStorage.getItem("Logged") === 'true') {
      this.logged = true;
    }
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
    this.navigateToLogin();
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
    this.navigateToLogin();
  }

  closeOrderResumeModal() {
    this.showOrderResumeModal = false;
  }

  makeOrder() {
    if(this.totalUnits === 0) {
      this.alertTool.presentToast("No tenes ningún producto en tu carrito");
    } else {
      if(this.logged) {
        this.navigateToOrderResume();
      } else {
        this.showLoginModal = true;
      }
    }
  }

  makeImageGuid(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.menuService.Image(id).subscribe(
        (response) => {
          const objectURL = URL.createObjectURL(response);
          resolve(objectURL);
        },
        (error) => {
          reject(null);
        }
      );
    });
  }

  async setImageForItem(item: any) {
    try {
      const url = await this.makeImageGuid(item.id);
      const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(url);
      item.image = sanitizedUrl;
    } catch (error) {
      console.log('Error fetching image', error);
      item.image = '';
    }
  }

  async formatToCartItems() {
    for (const menu of this.menus) {
      for (const prod of menu.products) {
        const item = new CartItem();
        item.id = prod.id;
        item.day = prod.day;
        item.name = prod.name;

        var hasImage = true;
        if(prod.imageName === "Default") {
          hasImage = false;
        }

        item.hasImage = hasImage;
        item.category = menu.category;

        await this.setImageForItem(item);
        item.price = menu.price;

        this.makeDeliveryDTO(prod);

        if (item.category === 'Estandar') {
          this.standardItems.push(item);
        } else if (item.category === 'Light') {
          this.lightItems.push(item);
        } else if (item.category === 'Proteico') {
          this.proteicItems.push(item);
        }
      }
    }

    for (let i = 0; i < 5; i++) {
      this.carouselItems.push(this.standardItems[i], this.lightItems[i], this.proteicItems[i]);  
    }
    this.cdr.detectChanges();
  }

  getSanitizedUrl(imageUrl: any) {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
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
    if(loader !== undefined) { 
      await this.loadingCtrl.dismiss();
    }
  }

  saveRole(role: number) {
    if(role === 0) {
      localStorage.setItem("role", "CLIENT");
    } else if( role === 1) {
      localStorage.setItem("role", "DELIVERY");
    } else if( role === 2) {
      localStorage.setItem("role", "ADMIN");
    }
  }

  makeDeliveryDTO(prod: ProductDTO) {
    var delivDTO = new DeliveryDTO();
        delivDTO.productId = prod.id;
        delivDTO.quantity = 0;
        delivDTO.delivered = false;
        delivDTO.deliveryDate = prod.day;

        if(prod.day === 0) {
          this.orderMonday.deliveries.push(delivDTO);
        } else if(prod.day === 1) {
          this.orderTuesday.deliveries.push(delivDTO);
        } else if(prod.day === 2) {
          this.orderWednesday.deliveries.push(delivDTO);
        } else if(prod.day === 3) {
          this.orderThursday.deliveries.push(delivDTO);
        } else if(prod.day === 4) {
          this.orderFriday.deliveries.push(delivDTO);
        }
  }
}
