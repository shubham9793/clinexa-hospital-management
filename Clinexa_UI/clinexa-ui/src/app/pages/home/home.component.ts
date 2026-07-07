import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  showLoginMenu = false;

  toggleLoginMenu(): void {
    this.showLoginMenu = !this.showLoginMenu;
  }

  closeLoginMenu(): void {
    this.showLoginMenu = false;
  }
}
