import { Injectable } from '@angular/core';
import { MainService } from '../MainService/main.service';
import { OrderDTO } from 'src/app/Models/OrderDTO';

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends MainService {

  GetFromUser(email: string) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.get(this.baseRoute + 'Orders/' + email, {headers});
  }

  GetOwn() {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Orders/own', {headers});
  }

  PlaceOrder(model: OrderDTO) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Orders/place', model, {headers})
  }

  RemoveOrder(orderId: number) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Orders/remove/' + orderId, {headers})
  }
}
