import { Injectable } from '@angular/core';
import { MainService } from '../MainService/main.service';
import { HttpHeaders } from '@angular/common/http';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { LoginDTO } from 'src/app/Models/LoginDTO';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends MainService {
  
  loginUser(user: LoginDTO): Observable<ResponseObjectModel<string>> {
    const headers = new HttpHeaders({
      'dontskip': 'true'
    });
  
    return this.http.post<ResponseObjectModel<string>>(this.baseRoute + 'Auth/login', user, { headers }).pipe(
      tap(response => {
        if (response.model) {
          //localStorage.setItem("token", response.model);  // ✅ Guarda el token correctamente
          //console.log("🔑 Token guardado:", response.model);
        } else {
          console.error("❌ No se recibió token en la respuesta.");
        }
      })
    );
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
