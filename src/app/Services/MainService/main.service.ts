import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  baseRoute: String;
  constructor(protected http: HttpClient)
  {
    this.baseRoute = "http://localhost:5009/api/";
  }

  protected createHeader(token: any) {
    var headers = new HttpHeaders({
      'Authorization': ('bearer ' + token)
    })

    return headers;
  }
}
