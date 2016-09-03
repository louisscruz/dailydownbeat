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

  getUser(username: string): Observable<any> {
    return this._http.get(this.apiUrl + '/api/users/' + username)
    .map(res => res.json());
  };

  confirmUser(username: string, confirmationCode: string): Observable<any> {
    let call = this.apiUrl + '/api/users/' + username + '/confirm/' + confirmationCode;
    return this._http.post(call, confirmationCode)
    .map(res => res.json());
  };

  getUserPosts(username: string): Observable<any> {
    return this._http.get(this.apiUrl + '/api/users/' + username + '/posts')
    .map(res => res.json());
  };

  getUserComments(username: string): Observable<any> {
    return this._http.get(this.apiUrl + '/api/users/' + username + '/comments')
    .map(res => res.json());
  };

  updateBio(bio: string): Observable<any> {
    let headers = this.generateHeaders();
    let id = this._jwtHelper.decodeToken(this.getToken()).id;
    let call = this.apiUrl + '/api/users/' + id;
    let user = { bio: bio };
    return this._http.put(call, JSON.stringify(user), {
      headers: headers
    })
    .map(res => res.json());
  }

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
    let username = this._jwtHelper.decodeToken(this.getToken()).username;
    let call = this.apiUrl + '/api/users/' + username + '/update_password';
    let user = {
      current_password: password,
      password: new_password,
      password_confirmation: new_password_confirmation
    };
    console.log(headers);
    return this._http.patch(call, JSON.stringify(user), {
      headers: headers
    })
    .map(res => res.json());
  };
}
