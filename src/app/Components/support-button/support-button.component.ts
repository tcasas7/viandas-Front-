import { Component } from '@angular/core';

@Component({
  selector: 'app-support-button',
  templateUrl: './support-button.component.html',
  styleUrls: ['./support-button.component.scss'],
})
export class SupportButtonComponent {

  contactNumber: string = "+542235629773";
  constructor() { }

  contactSupport() {
    window.open("whatsapp://send?phone=" + this.contactNumber + "&text=" + "Hola, necesito ayuda con mi pedido.")
  }
}
