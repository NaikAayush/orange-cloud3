import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css'],
})
export class SidebarItemComponent implements OnInit {
  active: boolean = false;
  brr: string = 'text-black';
  @Input() name: string = '';
  @Input() svg: string = '';

  constructor() {}

  ngOnInit() {
    if (this.active) {
      this.brr = 'bg-theme-primary bg-opacity-10';
    }
  }
}
