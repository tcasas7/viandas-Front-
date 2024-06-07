import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  carouselItems = [
    'Item 1 1', 'Item 1 2', 'Item 1 3',
    'Item 2 1', 'Item 2 2', 'Item 2 3', 
    'Item 3 1', 'Item 3 2', 'Item 3 3', 
    'Item 4 1', 'Item 4 2', 'Item 4 3', 
    'Item 5 1', 'Item 5 2', 'Item 5 3'];
  carouselSets: string[][] = [];
  currentIndex = 0;
  itemsPerSlide = 3;
  dayOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
  

  leftHiden: boolean = false;
  rightHiden: boolean = true;

  actualDayNumber = 0;
  actualDayName: string;

  constructor() {
    this.initializeCarouselSets();
    this.actualDayName = this.dayOfWeek[this.currentIndex];
  }

  initializeCarouselSets() {
    for (let i = 0; i < this.carouselItems.length; i += this.itemsPerSlide) {
      this.carouselSets.push(this.carouselItems.slice(i, i + this.itemsPerSlide));
    }
  }

  updateCarousel() {
    const carouselContent = document.querySelector('.carousel-content') as HTMLElement;
    const setWidth = 120; // Ancho del set + margen derecho
    const translateX = -this.currentIndex * setWidth;
    carouselContent.style.transform = `translateX(${translateX}px)`;
    this.actualDayName = this.dayOfWeek[this.currentIndex];

    if(this.currentIndex == 0) {
      this.leftHiden = false;
    } else if(this.currentIndex == 4) {
      this.rightHiden = false;
    } else {
      this.leftHiden = true;
      this.rightHiden = true;
    }
  }

  next() {
    if (this.currentIndex < this.carouselSets.length - 1) {
      this.currentIndex++;
      this.actualDayNumber++;
      this.updateCarousel();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.actualDayNumber--;
      this.updateCarousel();
    }
  }
}
