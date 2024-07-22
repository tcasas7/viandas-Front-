import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() confirmModalEvent = new EventEmitter<void>();

  weekDays: Array<number> = new Array<number>();
  selectedDate: any;

  constructor() { }

  ngOnInit() {
    this.calculateWeek();
  }

  confirmModal() {
    console.log(this.selectedDate);
    this.confirmModalEvent.emit();
  }
  closeModal() {
    this.closeModalEvent.emit();
  }

  calculateWeek() {
    var today = new Date();
    
    var monday = new Date();

    monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));

    this.weekDays.push(monday.getDate());
    this.weekDays.push(monday.getDate() + 1);
    this.weekDays.push(monday.getDate() + 2);
    this.weekDays.push(monday.getDate() + 3);
    this.weekDays.push(monday.getDate() + 4);

    console.log(this.weekDays);
  }

  makeDate() {

  }

  onChange(event: any) {
    this.selectedDate = event.target.value;
    console.log(this.selectedDate);
  }
}
