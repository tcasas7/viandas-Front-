import { Injectable } from '@angular/core';
import { MainService } from '../MainService/main.service';
import { RegisterDTO } from 'src/app/Models/RegisterDTO';
import { ChangePasswordDTO } from 'src/app/Models/ChangePasswordDTO';
import { ChangeRoleDTO } from 'src/app/Models/ChangeRoleDTO';
import { LocationDTO } from 'src/app/Models/LocationDTO';
import { ChangePhoneDTO } from 'src/app/Models/ChangePhoneDTO';
import { ContactDTO } from 'src/app/Models/ContactDTO';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends MainService{

  GetAll() {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.get(this.baseRoute + 'Users', {headers});
  }

  Register(model: RegisterDTO) {
    return this.http.post(this.baseRoute + 'Users/register', model);
  }

  ChangePassword(model: ChangePasswordDTO) {
    return this.http.post(this.baseRoute + 'Users/changePassword', model);
  }

  ChangeRole(model: ChangeRoleDTO) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Users/changeRole', model, {headers});
  }

  ChangePhone(model: ChangePhoneDTO) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    console.log(model);

    return this.http.post(this.baseRoute + 'Users/changePhone', model,  {headers});
  }

  GetData() {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.get(this.baseRoute + 'Users/data', {headers});
  }

  AddLocation(model: LocationDTO | undefined) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Users/addLocation', model, {headers});
  }

  MakeDefault(model: LocationDTO | undefined) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Users/makeDefault', model, {headers});
  }

  RemoveLocation(model: LocationDTO | undefined) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Users/removeLocation', model, {headers});
  }

  AddContact(model: ContactDTO | undefined) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Users/addContact', model, {headers});
  }

  GetContacts() {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.get(this.baseRoute + 'Users/getContacts', {headers});
  } 

  GetActiveContact() {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.get(this.baseRoute + 'Users/getActiveContact', {headers});
  }

  UpdateContact(model: ContactDTO | undefined) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Users/updateContact', model, {headers});
  }

  RemoveContact(model: ContactDTO | undefined) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Users/removeContact', model, {headers});
  }

  MakeActive(model: ContactDTO | undefined) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Users/makeActive', model, {headers});
  }

}
