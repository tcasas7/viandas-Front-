import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  //webAPI
  //baseRoute: String  = "https://7t0hcgph-8888.brs.devtunnels.ms/api/";
  baseRoute: String  = "http://localhost:5009/api/";
  constructor(protected http: HttpClient)
  {
    //localhost
    //this.baseRoute = "http://localhost:5009/api/";
  }

  protected createHeader(token: string | null, contentType: string = 'application/json'): HttpHeaders {
    const headersConfig: { [key: string]: string } = {
      'Authorization': `Bearer ${token || ''}`
    };

    // Solo agrega Content-Type si no es null (por ejemplo, para FormData)
    if (contentType) {
      headersConfig['Content-Type'] = contentType;
    }

    return new HttpHeaders(headersConfig);
  }
}