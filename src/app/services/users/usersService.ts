import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import {User} from '../../datatypes/user/user';

@Injectable()
export class UserService {
  private apiUrl: string = API_URL;

  constructor(
    private _http: Http,
    private _router: Router,
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

  postUser(user: any): Observable<any> {
    let headers = this.generateHeaders();
    return this._http.post(this.apiUrl + '/api/users', JSON.stringify(user), {
      headers: headers
    })
    //.map(res => res.json());
  };

  getUser(id: number | string): Observable<any> {
    return this._http.get(this.apiUrl + '/api/users/' + id)
    .map(res => res.json());
  };

  confirmUser(id: number | string, confirmationCode: string): Observable<any> {
    let call = this.apiUrl + '/api/users/' + id + '/confirm/' + confirmationCode;
    return this._http.post(call, confirmationCode)
    .map(res => res.json());
  };

  getUserPosts(id: number | string): Observable<any> {
    return this._http.get(this.apiUrl + '/api/users/' + id + '/posts')
    .map(res => res.json());
  };

  getUserComments(id: number | string): Observable<any> {
    return this._http.get(this.apiUrl + '/api/users/' + id + '/comments')
    .map(res => res.json());
  };

  updateEmail(email: string, password: string): Observable<any> {
    let headers = this.generateHeaders();
    let id = this._jwtHelper.decodeToken(this.getToken()).id;
    let call = this.apiUrl + '/api/users/' + id;
    let user = { email: email, current_password: password };
    return this._http.put(call, JSON.stringify(user), {
      headers: headers
    })
    .map(res => res.json());
  };

  updatePassword(password: string, new_password: string, new_password_confirmation: string): Observable<any> {
    let headers = this.generateHeaders();
    let id = this._jwtHelper.decodeToken(this.getToken()).id;
    let call = this.apiUrl + '/api/users/' + id + '/update_password';
    return this._http
    .patch(call, JSON.stringify({password, new_password, new_password_confirmation}), {
      headers: headers
    })
    .map(res => res.json());
  };
}
