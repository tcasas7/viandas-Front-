import { Component, OnInit } from '@angular/core';
import { MenusService } from 'src/app/Services/MenusService/menus.service';
import { ProductDTO } from 'src/app/Models/ProductDTO';
import { MenuDTO } from 'src/app/Models/MenuDTO';
import { HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-images',
  templateUrl: './add-images.page.html',
  styleUrls: ['./add-images.page.scss'],
})
export class AddImagesPage implements OnInit {
  menus: MenuDTO[] = [];
  selectedFiles: File[] = [];
  http: any;
  
  
  constructor(private menusService: MenusService,private alertController: AlertController, private router: Router) { }

  ngOnInit() {
    this.loadMenus();
  }

  loadMenus() {
    this.menusService.GetAll().subscribe(response => {
      this.menus = response.model;
    });
  }

  onFileSelected(event: any, product: ProductDTO) {
    const file: File = event.target.files[0];
    
    if (!file) return;

    
    const validExtensions = ["image/jpeg"];
    
    if (!validExtensions.includes(file.type)) {
        this.showAlert("Error", "Solo se permiten imágenes en formato JPG.");
        return;
    }

    product.imageFile = file;
}


  navigateToAddMenu() {
    this.router.navigate(['/add-menu']); // Ajusta la ruta según sea necesario
  }

  navigateToAdmin() {
    this.router.navigate(['/admin-page']); // Ajusta la ruta según sea necesario
  }
  
  uploadProductImage(productId: number, formData: FormData) {
    const token = localStorage.getItem('Token'); // Obtener el token del localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Agregar el token al header
    });
  
    return this.http.post(`http://localhost:5009/api/menus/changeImage/${productId}`, formData, { headers });
  }
  

  async uploadImages() {
    for (const menu of this.menus) {
      for (const product of menu.products) {
        if (product.imageFile) {
          const formData = new FormData();
          formData.append('file', product.imageFile, product.imageFile.name);
          this.menusService.uploadProductImage(product.id, formData).subscribe(
            async (response) => {
              await this.showAlert('Éxito', `Imagen para ${product.name} subida correctamente.`);
            },
            async (error) => {
              await this.showAlert('Error', `Hubo un error al subir la imagen para ${product.name}.`);
            }
          );
        }
      }
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
  

