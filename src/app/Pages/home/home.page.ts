import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { CartItem } from 'src/app/Models/CartItem';
import { MenuDTO } from 'src/app/Models/MenuDTO';
import { ResponseObjectList } from 'src/app/Models/Response/ResponseObjList';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { UserDTO } from 'src/app/Models/UserDTO';
import { MenusService } from 'src/app/Services/MenusService/menus.service';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';
import { ToDisplayOrderDTO } from 'src/app/Models/ToDisplayOrderDTO';
import { ToDisplayDeliveryDTO } from 'src/app/Models/ToDisplayDeliveryDTO';
import { PlaceOrderDTO } from 'src/app/Models/PlaceOrderDTO';
import { OrderDTO } from 'src/app/Models/OrderDTO';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('carouselContentWrapper', { static: false }) carouselContentWrapper!: ElementRef;
  dataResponse: ResponseObjectModel<UserDTO> = new ResponseObjectModel();

  logged: boolean = false;

  showLoginModal: boolean = false;
  showRegisterModal: boolean = false;
  showChangePasswordModal: boolean = false;
  showOrderResumeModal: boolean = false;
  showOrderDetailsModal: boolean = false;
  finalDiscountedTotal: number = 0;
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

  leftHidden: boolean = false;
  rightHidden: boolean = true;

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

  orders: Array<ToDisplayOrderDTO> = new Array<ToDisplayOrderDTO>();

  orderMonday: ToDisplayOrderDTO = new ToDisplayOrderDTO();
  orderTuesday: ToDisplayOrderDTO = new ToDisplayOrderDTO();
  orderWednesday: ToDisplayOrderDTO = new ToDisplayOrderDTO();
  orderThursday: ToDisplayOrderDTO = new ToDisplayOrderDTO();
  orderFriday: ToDisplayOrderDTO = new ToDisplayOrderDTO();

  total: number = 0;
  

  placeOrder!: PlaceOrderDTO;
  item: CartItem;
  baseRoute: any;

  constructor(
    private alertTool: AlertTool,
    private router: Router,
    private platform: Platform, 
    private sanitizer: DomSanitizer, 
    private menuService: MenusService,
    private cdr: ChangeDetectorRef,
    private userService: UsersService,
    private loadingCtrl: LoadingController,
    private http: HttpClient
  ) {
    this.item = new CartItem();
    this.menus = new Array<MenuDTO>();
    this.standardItems = new Array<CartItem>();
    this.lightItems = new Array<CartItem>();
    this.proteicItems = new Array<CartItem>();
    this.carouselItems = new Array<CartItem>();

    this.initializeApp();

    this.orders = new Array<ToDisplayOrderDTO>();

    this.orderMonday.deliveries = new Array<ToDisplayDeliveryDTO>();
    this.orderMonday.dayOfWeek = "Lunes";
    this.orderTuesday.deliveries = new Array<ToDisplayDeliveryDTO>();
    this.orderTuesday.dayOfWeek = "Martes";
    this.orderWednesday.deliveries = new Array<ToDisplayDeliveryDTO>();
    this.orderWednesday.dayOfWeek = "Miercoles";
    this.orderThursday.deliveries = new Array<ToDisplayDeliveryDTO>();
    this.orderThursday.dayOfWeek = "Jueves";
    this.orderFriday.deliveries = new Array<ToDisplayDeliveryDTO>();
    this.orderFriday.dayOfWeek = "Viernes";

    this.orders.push(this.orderMonday);
    this.orders.push(this.orderTuesday);
    this.orders.push(this.orderWednesday);
    this.orders.push(this.orderThursday);
    this.orders.push(this.orderFriday);

    this.actualDayName = this.daysOfWeek[this.currentIndex].day;

    this.placeOrder = new PlaceOrderDTO();
  }
  ngOnInit() {
    this.makeLoadingAnimation();
    this.instanceItems();

    this.actualDayName = this.daysOfWeek[this.currentIndex].day;
    this.cdr.detectChanges();
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
  
      // Iterar sobre los menús y productos para obtener las imágenes
      this.menus.forEach(menu => {
        console.log(`Menú: ${menu.category}, Productos:`, menu.products);
        menu.products.forEach(product => {
          console.log(`Producto ${product.name} tiene ID: ${product.id}`);
          this.menuService.Image(product.id).subscribe(blob => {
            const objectURL = URL.createObjectURL(blob);
            // Asegúrate de agregar el prefijo 'media/' a la URL de la imagen
            product.imagePath = `${this.baseRoute}media/${product.imagePath}`;
            console.log(`Image URL for product ${product.id}:`, objectURL);
          }, error => {
            console.error('Error fetching image', error);
          });
        });
      });
  
      await this.formatToCartItems();
      this.initializeCarouselSets();
      this.closeLoader();
    } catch (error) {
      this.closeLoader();
      this.alertTool.presentToast("Oops... Ocurrió un error");
      console.error('Error fetching data:', error);
    }
  }
  
  
  public sanitizeImageUrl(imageBlob: Blob): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
}

  ionViewDidEnter() {
    if(localStorage.getItem("Logged") === "true") {
      this.logged = true;
    } else {
      this.logged = false;
    }

    if(this.logged) {
      this.getData();
    }

  }

  initializeCarouselSets() {
    for (let i = 0; i < this.carouselItems.length; i += this.itemsPerSlide) {
      this.carouselSets.push(this.carouselItems.slice(i, i + this.itemsPerSlide));
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
      this.actualDayName = this.daysOfWeek[this.currentIndex].day;
      this.cdr.detectChanges(); // Detectar cambios después de actualizar el día
    }
  }
  
  next() {
    if (this.currentIndex < this.carouselSets.length - 1) {
      this.currentIndex++;
      this.updateCarousel();
      this.actualDayName = this.daysOfWeek[this.currentIndex].day;
      this.cdr.detectChanges(); // Detectar cambios después de actualizar el día
    }
  }
  
  updateCarousel() {
    const carouselContent = document.querySelector('.carousel-content') as HTMLElement;
    const setWidth = 77; // Ancho del set + margen derecho
    const translateX = -this.currentIndex * setWidth;
    carouselContent.style.transform = `translateX(${translateX}vw)`;
  
    this.actualDayName = this.daysOfWeek[this.currentIndex].day;
    this.leftHidden = this.currentIndex === 0;
    this.rightHidden = this.currentIndex === this.carouselSets.length - 1;
  }
  
  updateNavigationButtons() {
    this.leftHidden = this.currentIndex > 0;
    this.rightHidden = this.currentIndex < this.carouselSets.length - 1;
    this.actualDayName = this.daysOfWeek[this.currentIndex].day;
  }

  addToCart(item: CartItem) {
    if (this.isPastDayOrToday(item.day)) {
      this.alertTool.presentAlert(
        "Los viernes se actualiza el Menú", 
        "", 
        "🚫 No puedes agregar un pedido para el mismo día o días pasados."
      );
      return; // Bloqueamos la acción de agregar al carrito
    }
  
    item.total++;
    this.totalUnits++;
    this.modifyItemInOrders(item);
  }

  isPastDayOrToday(dayNumber: number): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Elimina la hora para comparar solo la fecha
  
    const todayDayOfWeek = today.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
  
    return dayNumber <= todayDayOfWeek && todayDayOfWeek !== 5;
  }
  
  
  modifyItemInOrders(item: CartItem) {
    for (const order of this.orders) {
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
    this.total = 0;
    this.finalDiscountedTotal = 0; // Reiniciar total con descuento
  
    // Obtener la cantidad mínima de platos desde el backend
    this.http.get<{ minimoPlatosDescuento: number }>('https://5d4lf267-5009.brs.devtunnels.ms/api/configuracion/minimo-platos-descuento')
      .subscribe(response => {
        const minimoPlatosDescuento = response.minimoPlatosDescuento;
  
        // Contar total de platos en la orden
        const totalPlatesForOrder = this.orders.reduce(
          (acc, order) =>
            acc +
            order.deliveries.reduce((dayAcc, delivery) => dayAcc + delivery.quantity, 0),
          0
        );
  
        console.log(`Total de Platos: ${totalPlatesForOrder} | Mínimo para descuento: ${minimoPlatosDescuento}`);
  
        // Procesar cada pedido y actualizar precios
        this.orders.forEach((order) => {
          let totalPlatesForDay = 0;
          order.deliveries.forEach((delivery) => {
            if (delivery.quantity > 0) {
              totalPlatesForDay += delivery.quantity;
  
              const menu = this.menus.find((menu) =>
                menu.products.some((product) => product.id === delivery.productId)
              );
              const product = menu?.products.find((p) => p.id === delivery.productId);
  
              if (product && menu) {
                // Obtener precios desde el menú
                delivery.productPrice = menu.price ?? 0;
                delivery.productPromoPrice = menu.precioPromo ?? menu.price ?? 0;
  
                // Aplicar descuento si corresponde
                delivery.appliedPrice = totalPlatesForOrder >= minimoPlatosDescuento
                  ? delivery.productPromoPrice
                  : delivery.productPrice;
                delivery.discountApplied = totalPlatesForOrder >= minimoPlatosDescuento;
  
                // Sumar precios al total
                this.total += delivery.productPrice * delivery.quantity;
                this.finalDiscountedTotal += delivery.appliedPrice * delivery.quantity;
  
                console.log(
                  `Producto: ${delivery.productName}, Cantidad: ${delivery.quantity}, ` +
                  `Normal: ${delivery.productPrice}, Promo: ${delivery.productPromoPrice}, ` +
                  `Aplicado: ${delivery.appliedPrice}`
                );
              }
            }
          });
  
          order.hasOrder = totalPlatesForDay > 0;
        });
  
        // Mostrar resumen de la orden
        console.log(`Total Normal: ${this.total}, Total con Descuento: ${this.finalDiscountedTotal}`);
        this.showOrderResumeModal = true;
      });
  }
  
  navigateToOrderDetails() {
    this.showOrderResumeModal = false;
    this.showOrderDetailsModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
    if(localStorage.getItem("Logged") === 'true') {
      this.logged = true;
      this.getData();
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
    this.placeOrder = new PlaceOrderDTO();
    this.showOrderResumeModal = false;
  }

  closeOrderDetailsModal() {
    this.placeOrder = new PlaceOrderDTO();
    this.showOrderDetailsModal = false;
  }

  makeOrder() {
    if(this.totalUnits === 0) {
      this.alertTool.presentToast("No tenes ningún producto en tu carrito");
    } else {
      if(this.logged) {
        //this.alertTool.presentToast("Funcionalidad en desarrollo");
      //Implementacion real
        this.orders.forEach(o => {
         // console.log(`Enviando pedido: Día de la semana: ${order.dayOfWeek}`);
          var order = new OrderDTO(o);
          order.price = 0;
          this.placeOrder.Orders.push(order);
          o.deliveries.forEach(d => {
            if(d.quantity > 0) {
              order.price += d.quantity * d.productPrice;
            }
        });
      });
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
          reject('');
        }
      );
    });
  }

  async setImageForItem(item: any) {
    try {
      const blob = await this.fetchImageBlob(item.id);
      item.sanitizedImagePath = this.getSanitizedUrl(blob);
      console.log(item.sanitizedImagePath); // Para verificar si la URL de la imagen es correcta
    } catch (error) {
      console.error('Error fetching image:', error);
      item.sanitizedImagePath = ''; // Manejar el error asignando un valor vacío
    }
  }
  
  fetchImageBlob(id: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.menuService.Image(id).subscribe(
        (response: Blob) => {
          resolve(response);
        },
        (error) => {
          console.error('Error fetching image from API:', error);
          reject(error);
        }
      );
    });
  }


  async formatToCartItems() {
    for (const menu of this.menus) {
      for (const prod of menu.products) {
        const item = new CartItem();
        item.id = prod.id;
        item.day = prod.day;
        item.name = prod.name;
        //console.log(`Producto: ${prod.name}, Día: ${prod.day}`);
        var hasImage = true;
        if(prod.imageName === "Default") {
          hasImage = false;
        }
  
        item.hasImage = hasImage;
        item.category = menu.category;
  
        await this.setImageForItem(item);
        item.price = menu.price;
  
        this.makeDeliveryDTO(item);
  
        if (item.category === 'Estandar') {
          this.standardItems.push(item);
        } else if (item.category === 'Light') {
          this.lightItems.push(item);
        } else if (item.category === 'Proteico') {
          this.proteicItems.push(item);
        }
      }
    }

    /*this.cdr.detectChanges();
  }*/
  
    // Añadir productos al carrusel para cada día
    for (let i = 0; i < 5; i++) {
      this.carouselItems.push(this.standardItems[i], this.lightItems[i], this.proteicItems[i]);  
    }
    this.cdr.detectChanges();
  }

  getSanitizedUrl(imageBlob: Blob): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
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

  getNextWeekday(day: number): Date {
    let today = new Date();
    let daysToAdd = (day - today.getDay() + 7) % 7;

    if (daysToAdd === 0) daysToAdd = 7; // Si es el mismo día, saltar a la próxima semana

    return new Date(today.setDate(today.getDate() + daysToAdd));
}

  getDayNumber(date: Date): number {
   const day = new Date(date).getDay();
   return day === 0 || day === 6 ? -1 : day; // Si es sábado o domingo, devolver -1 (no debería pasar)
  }

  getDayName(index: number): string {
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    return days[index] || "Día desconocido";
  }
  

  makeDeliveryDTO(prod: CartItem) {
    var delivDTO = new ToDisplayDeliveryDTO();
    delivDTO.productId = prod.id;
    delivDTO.quantity = 0;
    delivDTO.delivered = false;
    delivDTO.deliveryDate = this.getNextWeekday(prod.day); // ✅ Convertimos número a fecha
    delivDTO.productName = prod.name;
    delivDTO.productPrice = prod.price;

    // ✅ Asignar el DTO a la orden correspondiente según el día
    switch (prod.day) {
        case 1: this.orderMonday.deliveries.push(delivDTO); break;
        case 2: this.orderTuesday.deliveries.push(delivDTO); break;
        case 3: this.orderWednesday.deliveries.push(delivDTO); break;
        case 4: this.orderThursday.deliveries.push(delivDTO); break;
        case 5: this.orderFriday.deliveries.push(delivDTO); break;
        default: console.log('Día de entrega inválido:', prod.day); break;
    }
}

  getData() {
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

  getProductsForDay(dayNumber: number): CartItem[] {
    // Filtra los productos para el día específico
    return this.carouselItems.filter(item => item.day === dayNumber);
  }

}