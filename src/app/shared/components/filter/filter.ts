import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-filter',
  imports: [],
  templateUrl: './filter.html',
  styleUrl: './filter.scss'
})
export class Filter {
  readonly isSubmit = signal(false);
  readonly isOpenFilter = signal(false);

  openNav() {
    this.isOpenFilter.set(!this.isOpenFilter());
    if (this.isOpenFilter()) {
      (document.getElementById("mySidebar") as HTMLElement).style.width = "200px";
      (document.getElementById("main") as HTMLElement).style.marginLeft = "185px";
    } else {
      (document.getElementById("mySidebar") as HTMLElement).style.width = "0";
      (document.getElementById("main") as HTMLElement).style.marginLeft = "-11px";
    }
  }
}
