import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.page.html',
  styleUrls: ['./admin-orders.page.scss'],
})
export class AdminOrdersPage {

  constructor(private router: Router) { }

  navigateToAdmin() {
    this.router.navigate(["admin"]);
  }
}
