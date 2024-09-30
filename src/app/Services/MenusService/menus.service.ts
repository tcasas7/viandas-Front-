import { Injectable } from '@angular/core';
import { MainService } from '../MainService/main.service';
import { AddMenusDTO } from 'src/app/Models/AddMenusDTO';
import { MenuDTO } from 'src/app/Models/MenuDTO';
import { map } from 'rxjs/operators';
import { ProductDTO } from 'src/app/Models/ProductDTO';

@Injectable({
  providedIn: 'root'
})
export class MenusService extends MainService {

  /*GetAll() {
    return this.http.get(this.baseRoute + "menus");
  }*/

    GetAll() {
      return this.http.get<{ model: MenuDTO[] }>(this.baseRoute + "menus").pipe(
        map(response => {
          response.model.forEach((menu: MenuDTO) => {
            menu.products.forEach((product: ProductDTO) => {
              product.imagePath = `${this.baseRoute}menus/image/${product.id}`;
            });
          });
          return response;
        })
      );
    }
    

  AddMenus(model: AddMenusDTO) {
    let token = localStorage.getItem("Token");

    const headers = this.createHeader(token);

    return this.http.post(this.baseRoute + "menus/add", model, {headers});
  }

  Image(productId: number) {
    return this.http.get(this.baseRoute + "menus/image/" + productId, {responseType: 'blob'})
  }

  ChangeImage(model: FormData, id: number){
    let token = localStorage.getItem("Token");

    const headers = this.createHeader(token);

    return this.http.post(this.baseRoute + "menus/changeImage/" + id, model, {headers});
  }
}
