import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { UserDTO } from 'src/app/Models/UserDTO';
import { UsersService } from 'src/app/Services/UsersService/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  dataResponse: ResponseObjectModel<UserDTO> = new ResponseObjectModel();
  logged: boolean = false;

  constructor(
    private router: Router,
    private userService: UsersService
  ) { }

  ionViewWillEnter(){
    if(localStorage.getItem("Logged") === "true") {
      this.logged = true;
    }
    else {
      this.logged = false;
    }

    if(!this.logged) {
      this.router.navigate(["/login"]);
    }

    this.userService.GetData().subscribe( response => {
      this.dataResponse = response as ResponseObjectModel<UserDTO>;

      localStorage.setItem("firstName", this.dataResponse.model.firstName);
      localStorage.setItem("lastName", this.dataResponse.model.lastName);
      
      console.log(this.dataResponse.model);
    }, error => {
      console.log(error.message);
    })
  }

  navigateToHome() {
    this.router.navigate(["/home"]);
  }
}
