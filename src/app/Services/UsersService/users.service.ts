import { Injectable } from '@angular/core';
import { MainService } from '../MainService/main.service';
import { RegisterDTO } from 'src/app/Models/RegisterDTO';
import { ChangePasswordDTO } from 'src/app/Models/ChangePasswordDTO';
import { ChangeRoleDTO } from 'src/app/Models/ChangeRoleDTO';
import { LocationDTO } from 'src/app/Models/LocationDTO';

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

  ChangePhone(model: string) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Users/changePhone/' + model, model, {headers});
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

  RemoveLocation(model: LocationDTO | undefined) {
    var token = localStorage.getItem('Token');

    var headers = this.createHeader(token);

    return this.http.post(this.baseRoute + 'Users/removeLocation', model, {headers});
  }
}
