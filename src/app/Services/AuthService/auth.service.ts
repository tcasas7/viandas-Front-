import { Injectable } from '@angular/core';
import { MainService } from '../MainService/main.service';
import { HttpHeaders } from '@angular/common/http';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { LoginDTO } from 'src/app/Models/LoginDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends MainService {
  loginUser (user: LoginDTO) {
    const headers = new HttpHeaders({
      'dontskip':('true')
    })
    return this.http.post(this.baseRoute + 'Auth/login', user, {headers})
  }

  healthCheck() {
    return this.http.get(this.baseRoute + "Auth/health")
  }

  renewToken() {
    let token = localStorage.getItem("Token")

    const headers = this.createHeader(token);

    let result;

    this.http.get(this.baseRoute + "Auth/renew", {headers}).subscribe(response => {
      result = response as ResponseObjectModel<string>;
      localStorage.setItem("Token", result.model)
      return true;
    },
    error => {
      console.log(error)
      localStorage.removeItem("Token");
      return false;
    });
    return false;
  }
}
