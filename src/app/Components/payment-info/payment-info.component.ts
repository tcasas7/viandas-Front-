import { Component, EventEmitter, Output } from '@angular/core';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss'],
})
export class PaymentInfoComponent {

  @Output() closeModalEvent = new EventEmitter<void>();

  CBU: string = "1234567890123456789012";
  alias: string = "Test Alias";
  name: string = "Test Nombre";
  total: number = 1000;

  constructor(private alertTool: AlertTool) { }

  closeModal() {
    this.closeModalEvent.emit();
  }

  copyCBUToClipboard() {
    navigator.clipboard.writeText(this.CBU).then(() => {
      this.alertTool.presentToast("CBU copiado al portapapeles");
    }).catch(err => {
      this.alertTool.presentToast("Error al copiar CBU al portapapeles");
    });
  }
}
