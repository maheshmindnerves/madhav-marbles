import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxUiLoaderModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('madhav-marbles');
  ngOnInit(): void {
    console.log('11111111111111111');
    localStorage.setItem('abc', 'mahesh');
    console.log('44444444444444444', localStorage.getItem('abc'))
  }
}
