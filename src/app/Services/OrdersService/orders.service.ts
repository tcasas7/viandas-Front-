import { Injectable } from '@angular/core';
import { MainService } from '../MainService/main.service';
import { OrderDTO } from 'src/app/Models/OrderDTO';
import { PlaceOrderDTO } from 'src/app/Models/PlaceOrderDTO';

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends MainService {

  getDates() {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.get(this.baseRoute + 'Orders/getDates', {headers});
  }

  GetFromUser(email: string) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.get(this.baseRoute + 'Orders/' + email, {headers});
  }

  GetOwn() {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.get(this.baseRoute + 'Orders/own', {headers});
  }

  PlaceOrder(model: PlaceOrderDTO) {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);

    // Convertir a camelCase en el frontend
    const camelCaseModel = {
      orders: model.Orders.map(order => ({
        id: order.id,
        price: order.price,
        paymentMethod: order.paymentMethod.valueOf(),
        hasSalt: order.hasSalt,
        description: order.description,
        orderDate: order.orderDate,
        location: order.location,
        deliveries: order.deliveries.map(delivery => ({
          id: delivery.Id,
          productId: delivery.productId,
          delivered: delivery.delivered,
          deliveryDate: delivery.deliveryDate,
          quantity: delivery.quantity
        }))
      }))
    }
    return this.http.post(this.baseRoute + 'Orders/place', camelCaseModel, { headers });
}

  RemoveOrder(orderId: number) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Orders/remove/' + orderId, {headers})
  }
}
