import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ContactDTO } from 'src/app/Models/ContactDTO';
import { ResponseObjectList } from 'src/app/Models/Response/ResponseObjList';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { UserDTO } from 'src/app/Models/UserDTO';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-admin-payment-info',
  templateUrl: './admin-payment-info.page.html',
  styleUrls: ['./admin-payment-info.page.scss'],
})
export class AdminPaymentInfoPage {

  isAdmin: boolean = false;
  user: UserDTO;
  dataResponse: ResponseObjectModel<UserDTO> = new ResponseObjectModel();
  contactResponse: ResponseObjectList<ContactDTO> = new ResponseObjectModel();
  logged: boolean = false;

  selectedContactId!: any;

  selectedContact: ContactDTO | undefined;

  contacts!: Array<ContactDTO>;

  activeModal!: number;

  constructor(
    private loadingCtrl: LoadingController,
    private router: Router,
    private userService: UsersService,
    private alertTool: AlertTool
  )
  {
    this.user = new UserDTO();
    this.selectedContact = new ContactDTO();
  }


  ionViewWillEnter() {
    this.makeLoadingAnimation();
    if(localStorage.getItem("Logged") === "true") {
      this.logged = true;
    }
    else {
      this.logged = false;
    }

    if(!this.logged || localStorage.getItem("role") !== "ADMIN"){
      this.router.navigate(["/unauthorized"]);
    }

    this.getData();
  }

  makeLoadingAnimation() {
    this.loadingCtrl.getTop().then(hasLoading => {
      if (!hasLoading) {
          this.loadingCtrl.create({
              spinner: 'circular',
              cssClass: "custom-loading"
          }).then(loading => loading.present());
      }
  })
}

  async closeLoader() {
  
    this.checkAndCloseLoader();
  
    setTimeout(() => this.checkAndCloseLoader(), 500);
}

async checkAndCloseLoader() {
   
   const loader = await this.loadingCtrl.getTop();
   
    if(loader !== undefined) { 
      await this.loadingCtrl.dismiss();
    }
}

saveRole(role: number) {
  if(role === 0) {
    localStorage.setItem("role", "CLIENT");
    this.isAdmin = false;
  } else if( role === 1) {
    localStorage.setItem("role", "DELIVERY");
    this.isAdmin = false;
  } else if( role === 2) {
    localStorage.setItem("role", "ADMIN");
    this.isAdmin = true;
  }
}

async getData() {
  this.userService.GetData().subscribe( response => {
    this.dataResponse = response as ResponseObjectModel<UserDTO>;
    this.user = this.dataResponse.model;
    localStorage.setItem("firstName", this.dataResponse.model.firstName);
    localStorage.setItem("lastName", this.dataResponse.model.lastName);
    this.saveRole(this.dataResponse.model.role);
    this.getContacts();
    this.closeLoader();
  }, error => {
    this.closeLoader();
    this.logged = false;
    this.router.navigate(["/unauthorized"]);
    this.alertTool.presentToast("Oops... Ocurrió un error!");
  })
}

async getContacts() {
  this.userService.GetContacts().subscribe( response => {
    this.contactResponse = response as ResponseObjectList<ContactDTO>;
    this.contacts = this.contactResponse.model;

    this.selectedContact = this.getActive();

    this.selectedContactId = this.selectedContact.accountName;

    this.closeLoader();
  }, error => {
    this.alertTool.presentToast("Oops... Ocurrió un error!");
  })

}

navigateToAdmin() {
  this.router.navigate(["/admin"]);
}

openAddModal() {
  this.activeModal = 1;
}

openModifyModal() {
  this.activeModal = 2;
}

handleSelection(event: any) {
  if (event.detail.value === 'add_new') {
    this.openAddModal();
  } else {
    this.selectedContactId = event.detail.value;
    this.selectedContact = this.findContact(this.selectedContactId);
  }
}

findContact(accountName: string) {
  var contact = new ContactDTO();

  this.contacts.forEach(element => {
    if (element.accountName === accountName) {
      contact = element;
    }
  });

  return contact;
}

getActive() {
  var contact = new ContactDTO();

  this.contacts.forEach(element => {
    if(element.isActive) {
      contact = element;
    }
  })

  return contact;
}

removeContact() {
  this.makeLoadingAnimation();
  this.userService.RemoveContact(this.selectedContact).subscribe( response => {
    this.alertTool.presentToast("Eliminado con exito!");
    this.getContacts();
  }, error => {
    this.alertTool.presentToast("Oops... Ocurrió un error!");
  })
  this.closeLoader();
}
}
