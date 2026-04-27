import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
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

  ValidateUser(mobile: string): Observable<any> {
    return this.http.get(environment.baseApiUrl + 'Auth/ValidateUser?mobile=' + mobile);
  }
}