import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  //webAPI
  baseRoute: String  = "https://7t0hcgph-8888.brs.devtunnels.ms/api/";
  constructor(protected http: HttpClient)
  {
    //localhost
    this.baseRoute = "http://localhost:5009/api/";
  }

  protected createHeader(token: any) {
    var headers = new HttpHeaders({
      'Authorization': ('bearer ' + token)
    })

    return headers;
  }
}