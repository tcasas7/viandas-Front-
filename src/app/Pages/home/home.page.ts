import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { CartItem } from 'src/app/Models/CartItem';
import { MenuDTO } from 'src/app/Models/MenuDTO';
import { ResponseObjectList } from 'src/app/Models/Response/ResponseObjList';
import { MenusService } from 'src/app/Services/MenusService/menus.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  item1: CartItem = new CartItem();
  item2: CartItem = new CartItem();
  item3: CartItem = new CartItem();

  item4: CartItem = new CartItem();
  item5: CartItem = new CartItem();
  item6: CartItem = new CartItem();

  item7: CartItem = new CartItem();
  item8: CartItem = new CartItem();
  item9: CartItem = new CartItem();

  item10: CartItem = new CartItem();
  item11: CartItem = new CartItem();
  item12: CartItem = new CartItem();

  item13: CartItem = new CartItem();
  item14: CartItem = new CartItem();
  item15: CartItem = new CartItem();

  carouselItems = new Array;
  carouselSets: any[][] = [];
  currentIndex = 0;
  itemsPerSlide = 3;
  daysOfWeek: any[] = [
    { "day": 'Lunes', "class": 'monday'},
    { "day": 'Martes', "class": 'tuestday'},
    { "day": 'Miercoles', "class": 'wednesday'},
    { "day": 'Jueves', "class": 'thursday'},
    { "day": 'Viernes', "class": 'friday'}
  ]
  icon: string = "cart-outline"

  leftHiden: boolean = false;
  rightHiden: boolean = true;

  actualDayNumber = 1;
  actualDayName: any;

  totalUnits: number = 0;

  modalOpened: boolean = false;

  priceStandard: number = 4900;
  priceLight: number = 4500;
  priceProteic: number = 5200;

  isDesktop!: boolean;

  profileImageUrl: any;

  message!: ResponseObjectList<MenuDTO>;

  menus: MenuDTO[];

  standardItems: CartItem[];
  lightItems: CartItem[];
  proteicItems: CartItem[];

  constructor(
    private alertTool: AlertTool,
    private router: Router,
    private platform: Platform, 
    private sanitizer: DomSanitizer, 
    private menuService: MenusService
    ) {
      this.menus = new Array<MenuDTO>();
      this.standardItems = new Array<CartItem>()
      this.lightItems = new Array<CartItem>()
      this.proteicItems = new Array<CartItem>()
      this.carouselItems = new Array<CartItem>()

      this.initializeApp();

      this.instanceItems();
    
      this.actualDayName = this.daysOfWeek[this.currentIndex].day;
  }

  ionViewDidEnter(){
    this.makeImageGuid();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.isDesktop = this.platform.is('desktop');
    });
  }

  instanceItems() {
    /*this.item1.name = "Albondigas con arroz";
    this.item1.price = 4900;
    this.item4.name = "Tallarines";
    this.item4.price = 4900;
    this.item7.name = "Carbonada de pollo";
    this.item7.price = 4900;
    this.item10.name = "Brochette de cerdo";
    this.item10.price = 4900;
    this.item13.name = "Ternera";
    this.item13.price = 4900;

    this.item2.name = "Omelette de zanahoria y zuccini";
    this.item2.price = 4500;
    this.item5.name = "Milanesa de calabaza";
    this.item5.price = 4500;
    this.item8.name = "Wok de fideos de arroz";
    this.item8.price = 4500;
    this.item11.name = "Cazuela veggie";
    this.item11.price = 4500;
    this.item14.name = "Tarta capresse";
    this.item14.price = 4500;

    this.item3.name = "Lasagna proteica";
    this.item3.price = 5200;
    this.item6.name = "Pollo al disco";
    this.item6.price = 5200;
    this.item9.name = "Pastel de cerdo braseado";
    this.item9.price = 5200;
    this.item12.name = "Ternera con zapallitos";
    this.item12.price = 5200;
    this.item15.name = "Planchita de pollo";
    this.item15.price = 5200;

    this.carouselItems.push(
      this.item1, this.item2, this.item3,
      this.item4, this.item5, this.item6,
      this.item7, this.item8, this.item9,
      this.item10, this.item11, this.item12,
      this.item13, this.item14, this.item15,);*/

    this.menuService.GetAll().subscribe( response => {
      this.message = response as ResponseObjectList<MenuDTO>;
      this.menus = this.message.model;

      this.formatToCartItems();

      this.initializeCarouselSets();
    })
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
    item.total ++;
    this.totalUnits++;
  }

  removeFromCart(item: CartItem) {
    if(item.total <= 1)
      item.cartPressed = false;

    item.total--;
    this.totalUnits--;
  }

  pressCart(item: CartItem) {
    item.cartPressed = true;
  }

  navigateToProfile() {
    this.router.navigate(["/profile"])
  }

  makeOrder() {
    if(this.totalUnits === 0) {
      this.alertTool.presentToast("No tenes ningún producto en tu carrito");
    } else {
      this.alertTool.presentToast("Mostrar modal");
    }
  }

  makeImageGuid() {
    this.menuService.Image(3).subscribe(
      (response) => {
        const objectURL = URL.createObjectURL(response);
        this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      (error) => {
        console.error('Error loading profile image', error);
      }
    );
  }

  formatToCartItems() {
    this.menus.forEach(menu => {
      menu.products.forEach(prod => {
        var item = new CartItem();
        item.Id = prod.Id;
        item.day = prod.day;
        item.name = prod.name;
        item.category = menu.category;

        if(item.category === "Estandar") {
          item.price = this.priceStandard;
          this.standardItems.push(item);
        } else if(item.category === "Light") {
          item.price = this.priceLight;
          this.lightItems.push(item);
        } else if(item.category === "Proteico") {
          item.price = this.priceProteic;
          this.proteicItems.push(item);
        }
      });
    });

    for(let i = 0; i < 5; i++) {
      this.carouselItems.push(this.standardItems[i], this.lightItems[i], this.proteicItems[i]);
    }
  }
}
