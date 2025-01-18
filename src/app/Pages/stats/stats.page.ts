import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { UserDTO } from 'src/app/Models/UserDTO';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage {

  clientes: any[] = [];
  dataResponse: ResponseObjectModel<UserDTO> = new ResponseObjectModel();
  user: UserDTO;
  isAdmin: boolean = false;
  didLoad: boolean = false;
  logged: boolean = false;

  isWeb: boolean = false;

  constructor(
    private router: Router,
    private userService: UsersService,
    private loadingCtrl: LoadingController,
    private alertTool: AlertTool,
    private platform: Platform,
    private cdr: ChangeDetectorRef
  ) 
  {
    this.user = new UserDTO();
  }

  navigateToAdmin() {
    this.router.navigate(["admin"]);
  }

  ionViewWillEnter() {
    this.makeLoadingAnimation();

    if (localStorage.getItem('Logged') === 'true') {
      this.logged = true;
    } else {
      this.logged = false;
    }

    if (!this.logged || localStorage.getItem('role') !== 'ADMIN') {
      this.router.navigate(['/unauthorized']);
    }

    this.checkPlatform();
    this.obtenerClientesPendientes(); 
  }

  obtenerClientesPendientes() {
    this.userService.GetPendingUsers().subscribe(
      (response: any) => {
        if (response && response.model) {
          this.clientes = response.model;
          console.log('Clientes cargados:', this.clientes);
        } else {
          this.alertTool.presentToast('No se encontraron clientes pendientes.');
        }
        this.didLoad = true;
        this.closeLoader(); // Asegura que el spinner se cierra
        this.cdr.detectChanges(); // Forzar actualización del DOM
      },
      (error) => {
        this.alertTool.presentToast('Oops... Ocurrió un error al cargar los clientes!');
        this.didLoad = true;
        this.closeLoader(); // Asegura que el spinner se cierra
        this.cdr.detectChanges(); // Forzar actualización del DOM
      }
    );
  }
  
  aprobarCliente(clienteId: number) {
    this.userService.ApproveUser(clienteId).subscribe({
      next: () => {
        this.clientes = this.clientes.filter(cliente => cliente.id !== clienteId); // Elimina el cliente aprobado de la lista
        this.alertTool.presentToast('Cliente aprobado exitosamente!');
      },
      error: () => {
        this.alertTool.presentToast('Oops... No se pudo aprobar el cliente!');
      }
    });
  }
  rechazarCliente(clienteId: number) {
    this.userService.RejectUser(clienteId).subscribe({
      next: () => {
        this.clientes = this.clientes.filter(cliente => cliente.id !== clienteId);
        this.alertTool.presentToast('Cliente rechazado exitosamente!');
      },
      error: (err) => {
        console.error('Error al rechazar cliente:', err);
        this.alertTool.presentToast('Oops... No se pudo rechazar el cliente!');
      }
    });
  }
  
  makeLoadingAnimation() {
    this.loadingCtrl.getTop().then(hasLoading => {
      if (!hasLoading) {
        this.loadingCtrl
          .create({
            spinner: 'circular',
            cssClass: 'custom-loading',
          })
          .then(loading => loading.present());
      }
    });
  }

  async closeLoader() {
    this.checkAndCloseLoader();
    setTimeout(() => this.checkAndCloseLoader(), 500);
  }

  async checkAndCloseLoader() {
    const loader = await this.loadingCtrl.getTop();
    if (loader !== undefined) {
      await this.loadingCtrl.dismiss();
    }
  }

  checkPlatform() {
    if (this.platform.is('desktop')) {
      this.isWeb = true;
    }
  }
}

