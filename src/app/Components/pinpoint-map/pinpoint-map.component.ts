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
    this.geocodeAddress('Jose Hernandez, 720, Mar del Plata, Buenos Aires, Argentina', "1");
    this.geocodeAddress('Almirante Brown, 9153, Mar del Plata, Buenos Aires, Argentina', "3");
  }

  loadMap() {
    const latLng = new google.maps.LatLng(-38.00689925430091, -57.56997953603233);

    const mapOptions = {
      center: latLng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  geocodeAddress(direccion: string, id: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': direccion }, (results: { geometry: { location: any; }; }[], status: string) => {
      if (status === 'OK') {
        this.createMarker(results, id);
      } else {
        alert('Geocode no fue exitoso por la siguiente razón: ' + status);
      }
    });
  }

  createMarker(results: any, id: string) {
    new google.maps.Marker({
      map: this.map,
      position: results[0].geometry.location,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#abc49a",
        fillOpacity: 1.0,
        strokeWeight: 2,
        strokeOpacity: 1,
        strokeColor: "#ffbdb4",
        rotation: 30
      },
      animation: google.maps.Animation.DROP,
      label: {
        text: id,
        color: "dark-gray",
        fontWeight: 'bold',
        fontSize: '11px',
      }
    });
  }

}
