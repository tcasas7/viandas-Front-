import { Injectable } from '@angular/core';
import { MainService } from '../MainService/main.service';
import { AddMenusDTO } from 'src/app/Models/AddMenusDTO';

@Injectable({
  providedIn: 'root'
})
export class MenusService extends MainService {

  GetAll() {
    return this.http.get(this.baseRoute + "menus");
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
