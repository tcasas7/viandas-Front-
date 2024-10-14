import { Injectable } from '@angular/core';
import { MainService } from '../MainService/main.service';
import { HttpHeaders } from '@angular/common/http';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { LoginDTO } from 'src/app/Models/LoginDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends MainService {
  
  loginUser(user: LoginDTO): Observable<ResponseObjectModel<string>> {
    const headers = new HttpHeaders({
      'dontskip': 'true'
    });
    
    // Devuelve el Observable para que el componente se suscriba
    return this.http.post<ResponseObjectModel<string>>(this.baseRoute + 'Auth/login', user, { headers });
  }


  // Método para verificar el estado del servidor
  healthCheck() {
    return this.http.get(this.baseRoute + "Auth/health");
  }

  renewToken() {
    let token = localStorage.getItem("Token");

    const headers = this.createHeader(token);

    this.http.get(this.baseRoute + "Auth/renew", { headers }).subscribe(response => {
      const result = response as ResponseObjectModel<string>;
      localStorage.setItem("Token", result.model);
    }, error => {
      console.log(error);
      localStorage.removeItem("Token");
    });
  }
}
