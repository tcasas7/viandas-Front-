import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  baseRoute: String;
  constructor(protected http: HttpClient)
  {
    this.baseRoute = "https://7t0hcgph-8888.brs.devtunnels.ms/api/";
  }

  protected createHeader(token: any) {
    var headers = new HttpHeaders({
      'Authorization': ('bearer ' + token)
    })

    return headers;
  }
}
