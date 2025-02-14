import { Injectable } from '@angular/core';
import { MainService } from '../MainService/main.service';
import { OrderDTO } from 'src/app/Models/OrderDTO';
import { PlaceOrderDTO } from 'src/app/Models/PlaceOrderDTO';
import { catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends MainService {

  private baseUrl = 'http://localhost:5009/api/Orders';

  GetAll(): Observable<ResponseObjectModel<Array<OrderDTO>>> {
    const token = localStorage.getItem('Token'); // Obtén el token del almacenamiento
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Añade el token al encabezado
    });
  
    return this.http.get<ResponseObjectModel<Array<OrderDTO>>>(`${this.baseRoute}Orders/getAll`, { headers });
  }
  
  

  confirmOrder(orderId: number): Observable<any> {
    const token = localStorage.getItem('Token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`http://localhost:5009/api/Orders/confirm/${orderId}`, null, { headers });
  }

  cancelOrder(orderId: number): Observable<any> {
    const token = localStorage.getItem('Token'); // Asegurar el nombre correcto de la clave en localStorage
  
    if (!token) {
      console.error("🚨 No hay token en localStorage");
      return throwError(() => new Error('No estás autenticado'));
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token.trim()}`,
      'Content-Type': 'application/json'
    });
  
    const url = `${this.baseUrl}/${orderId}`; // ✅ URL correcta
  
    console.log("📡 Enviando petición DELETE a:", url);
  
    return this.http.delete(url, { headers }).pipe(
      tap(() => console.log('✅ Orden eliminada con éxito')),
      catchError(error => {
        console.error('❌ Error al eliminar la orden:', error);
        return throwError(() => error);
      })
    );
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
        orderDate: order.orderDate instanceof Date ? order.orderDate.toISOString() : order.orderDate,
        location: order.location,
        deliveries: order.deliveries.map(delivery => ({
          id: delivery.Id,
          productId: delivery.productId,
          delivered: delivery.delivered,
          deliveryDate: delivery.deliveryDate instanceof Date ? delivery.deliveryDate.toISOString() : delivery.deliveryDate,
          quantity: delivery.quantity
        }))
      }))
    };

    console.log("📦 JSON a enviar:", JSON.stringify(camelCaseModel, null, 2));
    return this.http.post(this.baseRoute + 'Orders/place', camelCaseModel, { headers });

  }

  GetProductsByOrderId(orderId: number): Observable<any> {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    
    return this.http.get(this.baseRoute + 'Orders/getProducts/' + orderId, { headers });
  }

}
