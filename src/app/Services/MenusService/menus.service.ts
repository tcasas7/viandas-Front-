import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddMenusDTO } from 'src/app/Models/AddMenusDTO';
import { Observable } from 'rxjs';
import { MenuDTO } from 'src/app/Models/MenuDTO';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  private baseRoute = 'http://localhost:5009/api/';  // Cambia según tu backend

  constructor(private http: HttpClient) {}

  GetAll(): Observable<{ model: MenuDTO[] }> {
    return this.http.get<{ model: MenuDTO[] }>(this.baseRoute + 'menus');
  }
  
  AddMenus(model: AddMenusDTO): Observable<any> {
    let token = localStorage.getItem("Token");

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.baseRoute}menus/add`, model, { headers });
  }

  Image(productId: number) {
    return this.http.get(this.baseRoute + "menus/image/" + productId, {responseType: 'blob'})
  }

  ChangeImage(model: FormData, id: number){
    let token = localStorage.getItem("Token");

    const headers = this.createHeader(token);

    return this.http.post(this.baseRoute + "menus/changeImage/" + id, model, {headers});
  }

  uploadProductImage(productId: number, formData: FormData) {
    let token = localStorage.getItem("Token");
  
    const headers = this.createHeader(token);
  
    // Cambia la URL según la configuración del backend
    const url = `${this.baseRoute}menus/changeImage/${productId}`;
    
    return this.http.post(url, formData, { headers });
  }
  

  createHeader(token: string | null): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // No agregues Content-Type aquí cuando uses FormData
    });
  }
  
}




