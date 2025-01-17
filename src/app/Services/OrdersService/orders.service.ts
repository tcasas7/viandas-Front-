import { Injectable } from '@angular/core';
import { MainService } from '../MainService/main.service';
import { OrderDTO } from 'src/app/Models/OrderDTO';
import { PlaceOrderDTO } from 'src/app/Models/PlaceOrderDTO';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends MainService {

  
  confirmOrder(orderId: number): Observable<any> {
    const token = localStorage.getItem('Token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`http://localhost:5009/api/Orders/confirm/${orderId}`, null, { headers });
  }

  cancelOrder(orderId: number) {
    const token = localStorage.getItem('token');
    console.log('Token actual:', token);
    if (!token) {
      alert('No estás autenticado');
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.delete(`http://localhost:5009/api/Orders/${orderId}`, { headers });
  }
  
  

  getDates(): Observable<any> {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);

    return this.http.get(this.baseRoute + 'Orders/getDates', { headers });
  }

  GetFromUser(email: string): Observable<any> {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);

    return this.http.get(this.baseRoute + 'Orders/' + email, { headers });
  }

  GetOwn(): Observable<any> {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);

    return this.http.get(this.baseRoute + 'Orders/own', { headers });
  }

  PlaceOrder(model: PlaceOrderDTO): Observable<any> {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);

    
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
    };

    return this.http.post(this.baseRoute + 'Orders/place', camelCaseModel, { headers });
  }

  RemoveOrder(orderId: number): Observable<any> {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);

    // Cambiamos el método a DELETE y corregimos la URL
    return this.http.delete(this.baseRoute + 'Orders/remove/' + orderId, { headers });
  }

  GetProductsByOrderId(orderId: number): Observable<any> {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    
    return this.http.get(this.baseRoute + 'Orders/getProducts/' + orderId, { headers });
  }

}
