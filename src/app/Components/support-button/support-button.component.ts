import { ContactDTO } from './../../Models/ContactDTO';
import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-support-button',
  templateUrl: './support-button.component.html',
  styleUrls: ['./support-button.component.scss'],
})
export class SupportButtonComponent {
  @Input() phone!: string;
  @Input() wppMessage!: string;
  constructor()
  {
  }

  contactSupport() {
    const formattedPhone = this.phone.replace(/\s+/g, '');
    window.open(`whatsapp://send?phone=${formattedPhone}&text=${encodeURIComponent(this.wppMessage)}`);
  }
}
