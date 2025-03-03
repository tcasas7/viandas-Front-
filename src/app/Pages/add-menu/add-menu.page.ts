import { Component } from '@angular/core';
import { AddMenusDTO } from 'src/app/Models/AddMenusDTO';
import { MenuDTO } from 'src/app/Models/MenuDTO';
import { ProductDTO } from 'src/app/Models/ProductDTO';
import { MenusService } from 'src/app/Services/MenusService/menus.service';
import { AlertTool } from 'src/app/Tools/AlertTool';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.page.html',
  styleUrls: ['./add-menu.page.scss'],
})


export class AddMenuPage {

  minimoPlatosDescuento?: number;

  apiUrl = 'http://localhost:5009/api/configuracion';

  constructor(
    private menusService: MenusService,
    private alertTool: AlertTool,
    private loadingCtrl: LoadingController,
    private router: Router,
    private http: HttpClient
    
  ) {
    // Cargar menús al iniciar
    this.loadMenusFromBackend();
    this.getMinimoPlatosDescuento();
  }

  getMinimoPlatosDescuento() {
    this.http.get<{ minimoPlatosDescuento: number }>(`${this.apiUrl}/minimo-platos-descuento`).subscribe(response => {
      this.minimoPlatosDescuento = response.minimoPlatosDescuento;
    });
  }

  async updateMinimoPlatosDescuento() {
    if (!this.minimoPlatosDescuento || this.minimoPlatosDescuento < 1) {
      this.alertTool.presentToast("⚠️ Ingrese un valor válido mayor a 0.");
      return;
    }
  
    const loading = await this.loadingCtrl.create({ message: "Actualizando..." });
    await loading.present();
  
    this.http.post(`${this.apiUrl}/minimo-platos-descuento`, this.minimoPlatosDescuento, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe(() => {
      loading.dismiss();
      this.alertTool.presentToast("✅ Se actualizó la cantidad mínima de platos.");
    }, error => {
      loading.dismiss();
      console.error("Error al actualizar el mínimo de platos:", error);
      this.alertTool.presentToast("❌ Hubo un error al actualizar el mínimo de platos.");
    });
  }
  
  
  async saveMinimoPlatosDescuento(newValue: number) {
    const loading = await this.loadingCtrl.create({ message: "Actualizando..." });
    await loading.present();
  
    this.http.post(`${this.apiUrl}/minimo-platos-descuento`, newValue, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe(() => {
      this.minimoPlatosDescuento = newValue;
      loading.dismiss();
      this.alertTool.presentToast("✅ Se actualizó la cantidad mínima de platos.");
    }, error => {
      loading.dismiss();
      console.error("Error al actualizar el mínimo de platos:", error);
      this.alertTool.presentToast("❌ Hubo un error al actualizar el mínimo de platos.");
    });
  }
  
  
navigateToAddImages() {
this.router.navigate(['/add-images']);
}
navigateToAdmin() {
this.router.navigate(['/admin']);
}

  // Menús y productos
  standardMenu: MenuDTO = new MenuDTO();
  lightMenu: MenuDTO = new MenuDTO();
  proteicMenu: MenuDTO = new MenuDTO();

  standardProducts: ProductDTO[] = [];
  lightProducts: ProductDTO[] = [];
  proteicProducts: ProductDTO[] = [];

  // Precios
  standardPrice: number = 0;
  lightPrice: number = 0;
  proteicPrice: number = 0;

  standardPromoPrice: number = 0;
  lightPromoPrice: number = 0;
  proteicPromoPrice: number = 0;

  // Control de visualización (collapse)
  standardIsCollapsed: boolean = true;
  lightIsCollapsed: boolean = true;
  proteicIsCollapsed: boolean = true;

  // Payload a enviar
  toSendPayload: AddMenusDTO = new AddMenusDTO();

  
  // Cargar menús y productos desde el backend
  loadMenusFromBackend() {
    this.menusService.GetAll().subscribe(response => {
      const loadedMenus: MenuDTO[] = response.model;  // Tipar explícitamente como 'MenuDTO[]'
  
      // Asignar menús
      this.standardMenu = loadedMenus.find((menu: MenuDTO) => menu.category === 'Estandar') || new MenuDTO();
      this.lightMenu = loadedMenus.find((menu: MenuDTO) => menu.category === 'Light') || new MenuDTO();
      this.proteicMenu = loadedMenus.find((menu: MenuDTO) => menu.category === 'Proteico') || new MenuDTO();
  
      // Asignar productos
      this.standardProducts = this.standardMenu.products || [];
      this.lightProducts = this.lightMenu.products || [];
      this.proteicProducts = this.proteicMenu.products || [];
  
      // Asignar precios
      this.standardPrice = this.standardMenu.price || 0;
      this.lightPrice = this.lightMenu.price || 0;
      this.proteicPrice = this.proteicMenu.price || 0;

      this.standardPromoPrice = this.standardMenu.precioPromo || 0;
      this.lightPromoPrice = this.lightMenu.precioPromo || 0;
      this.proteicPromoPrice = this.proteicMenu.precioPromo || 0;
  
    }, error => {
      console.error("Error al cargar menús:", error);
    });
  }

  
  // Expandir/colapsar los menús
  collapseStandard() { this.standardIsCollapsed = true; }
  uncollapseStandard() { this.standardIsCollapsed = false; }

  collapseLight() { this.lightIsCollapsed = true; }
  uncollapseLight() { this.lightIsCollapsed = false; }

  collapseProteic() { this.proteicIsCollapsed = true; }
  uncollapseProteic() { this.proteicIsCollapsed = false; }

  // Formatear y enviar los menús al backend
  sendMenus() {
    this.formatMenus();

    this.menusService.AddMenus(this.toSendPayload).subscribe(response => {
      if (response.statusCode === 200) {
        this.alertTool.presentToast('Menús actualizados correctamente');
      } else {
        this.alertTool.presentToast('Error al actualizar los menús');
      }
    }, error => {
      console.error("Error al enviar menús:", error);
      this.alertTool.presentToast('Error al enviar los menús');
    });
  }

  formatMenus() {
    this.standardMenu.products = this.standardProducts;
    this.standardMenu.price = this.standardPrice;
    this.standardMenu.precioPromo = this.standardPromoPrice; // Precio promocional
  
    this.lightMenu.products = this.lightProducts;
    this.lightMenu.price = this.lightPrice;
    this.lightMenu.precioPromo = this.lightPromoPrice; // Precio promocional
  
    this.proteicMenu.products = this.proteicProducts;
    this.proteicMenu.price = this.proteicPrice;
    this.proteicMenu.precioPromo = this.proteicPromoPrice; // Precio promocional
  
    this.toSendPayload.Menus = [this.standardMenu, this.lightMenu, this.proteicMenu];
  }
  
}


















