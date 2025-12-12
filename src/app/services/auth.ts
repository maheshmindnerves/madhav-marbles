import { inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /*  private loggedIn = signal<boolean>(false); */

  isAuthenticated(): boolean {
    const key = localStorage.getItem('token');
    if (key) {
      return true;
    } else {
      return false;
    }
    /* return this.loggedIn(); */
  }

  login() {
    /* this.loggedIn.set(true); */
    localStorage.setItem('token', 'Key-ABCDE22223');
  }

  logout() {
    /* this.loggedIn.set(false); */
    localStorage.clear();
  }
}