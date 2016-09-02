import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthHttp, tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { User } from '../../datatypes/user/user';

interface ValidationResult {
  [key: string]: boolean;
}

@Injectable()
export class AuthService {
  public adminMode: boolean = false;
  public currentUser: User;
  public isAdmin: boolean = false;
  private apiUrl: string = API_URL;
  public redirectUrl: string;

  constructor(
    private http: Http,
    private router: Router,
    private authHttp: AuthHttp,
    private _jwtHelper: JwtHelper
  ) {}

  generateHeaders(): Headers {
    let headers = new Headers();
    let token = this.getToken();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return headers;
  }

  getToken(): string {
    return localStorage.getItem('auth_token');
  }

  saveJwt(jwt) {
    localStorage.setItem('auth_token', jwt);
  }

  deleteJwt() {
    localStorage.removeItem('auth_token');
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  isLoggedIn(): boolean {
    let token = localStorage.getItem('auth_token');
    if (token) {
      if (tokenNotExpired(null, token)) {
        let decodedToken = this._jwtHelper.decodeToken(token);
        this.currentUser = new User(
          decodedToken.id,
          token,
          decodedToken.username,
          decodedToken.email,
          decodedToken.bio,
          decodedToken.confirmed,
          decodedToken.admin,
          decodedToken.points
        );
        if (this.currentUser.admin) {
          this.isAdmin = true;
        }
        return true;
      } else {
        this.currentUser = null;
      }
    }
    return false;
  }

  isSelf(id: number): boolean {
    if (this.currentUser) {
      return id === this.currentUser.id;
    }
    return false;
  }

  login(user) {
    let headers = this.generateHeaders();
    return this.authHttp.post(this.apiUrl + '/api/login', JSON.stringify(user), {
      headers: headers
    })
    .map(res => res.json());
  }

  logout() {
    this.currentUser = null;
    this.adminMode = false;
    let token = localStorage.getItem('auth_token');
    this.deleteJwt();
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', token);
    return this.authHttp.delete(this.apiUrl + '/api/logout', {
      headers: header
    });
  }

  checkEmailAvailability(email: string): Observable<Response> {
    let headers = this.generateHeaders();
    return this.authHttp.get(this.apiUrl + '/api/address/validate?email=' + email, {
      headers: headers
    })
    .map(res => res.json());
  }

  checkUsernameAvailability(username: string): Observable<Response> {
    let headers = this.generateHeaders();
    return this.authHttp.get(this.apiUrl + '/api/username/validate?username=' + username, {
      headers: headers
    })
    .map(res => res.json())
  }
}
