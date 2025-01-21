import { Injectable } from '@angular/core';
import { MainService } from '../MainService/main.service';
import { RegisterDTO } from 'src/app/Models/RegisterDTO';
import { ChangePasswordDTO } from 'src/app/Models/ChangePasswordDTO';
import { ChangeRoleDTO } from 'src/app/Models/ChangeRoleDTO';
import { LocationDTO } from 'src/app/Models/LocationDTO';
import { ChangePhoneDTO } from 'src/app/Models/ChangePhoneDTO';
import { ContactDTO } from 'src/app/Models/ContactDTO';
import { Observable } from 'rxjs';
import { UserDTO } from 'src/app/Models/UserDTO';
import { HttpHeaders } from '@angular/common/http';
import { ResponseObject } from 'src/app/Models/Response/ResponseObj';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends MainService {
  GetAll() {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.get(`${this.baseRoute}Users`, { headers });
  }

  Register(model: RegisterDTO) {
    return this.http.post(`${this.baseRoute}Users/register`, model);
  }

  ChangePassword(model: ChangePasswordDTO) {
    return this.http.post(`${this.baseRoute}Users/changePassword`, model);
  }

  ChangeRole(model: ChangeRoleDTO) {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.post(`${this.baseRoute}Users/changeRole`, model, { headers });
  }

  ChangePhone(model: ChangePhoneDTO) {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.post(`${this.baseRoute}Users/changePhone`, model, { headers });
  }

  GetData() {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.get(`${this.baseRoute}Users/data`, { headers });
  }

  AddLocation(model: LocationDTO | undefined) {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.post(`${this.baseRoute}Users/addLocation`, model, { headers });
  }

  MakeDefault(model: LocationDTO | undefined) {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.post(`${this.baseRoute}Users/makeDefault`, model, { headers });
  }

  RemoveLocation(model: LocationDTO): Observable<ResponseObject> {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.post<ResponseObject>(`${this.baseRoute}Users/removeLocation`, model, { headers });
  }
  
  AddContact(model: ContactDTO | undefined) {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.post(`${this.baseRoute}Users/addContact`, model, { headers });
  }

  GetContacts() {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.get(`${this.baseRoute}Users/getContacts`, { headers });
  }

  GetActiveContact() {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.get(`${this.baseRoute}Users/getActiveContact`, { headers });
  }

  UpdateContact(model: ContactDTO | undefined) {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.post(`${this.baseRoute}Users/updateContact`, model, { headers });
  }

  RemoveContact(model: ContactDTO | undefined) {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.post(`${this.baseRoute}Users/removeContact`, model, { headers });
  }

  MakeActive(model: ContactDTO | undefined) {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.post(`${this.baseRoute}Users/makeActive`, model, { headers });
  }

  GetPendingUsers() {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.get(`${this.baseRoute}Users/pendingUsers`, { headers });
  }

  ApproveUser(userId: number) {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.put(`${this.baseRoute}Users/approveUser/${userId}`, {}, { headers });
  }

  RejectUser(clienteId: number) {
    const headers = new HttpHeaders({
      'dontskip': 'true', 
      Authorization: `Bearer ${localStorage.getItem('Token')}`, // Nota: Asegúrate de que el token se llama "Token" con mayúscula
      'Content-Type': 'application/json-patch+json'
    });
  
    const url = this.baseRoute + 'Users/rejectUser';
  
    return this.http.post(url, clienteId, { headers });
  }
  
  getUserProfile(): Observable<UserDTO> {
    const token = localStorage.getItem('Token');
    const headers = this.createHeader(token);
    return this.http.get<UserDTO>(`${this.baseRoute}Users/data`, { headers });
  }
}
