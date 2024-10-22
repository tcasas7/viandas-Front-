import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
declare var google: any; // Add this line to declare the 'google' variable
@Component({
  selector: 'app-pinpoint-map',
  templateUrl: './pinpoint-map.component.html',
  styleUrls: ['./pinpoint-map.component.scss'],
})
export class PinpointMapComponent  implements OnInit {
  @Output() closeModalEvent = new EventEmitter<void>();
  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  map: any;
  constructor() { }
  ngOnInit() {
    this.loadMap();
  }
  loadMap() {
    const latLng = new google.maps.LatLng(-38.0087964438959, -57.55303618419129);
    const mapOptions = {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }
  closeModal() {
    this.closeModalEvent.emit();
  }
}