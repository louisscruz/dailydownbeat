import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {User} from '../../datatypes/user/user';

import {JwtHelper} from 'angular2-jwt';

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

  postUser(user) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._http.post(this.apiUrl + '/api/users', JSON.stringify(user), {
      headers: headers
    })
    .map(res => res.json())
    .subscribe(
      res => alert('yippee'),
      err => console.log(err),
      () => this._router.navigate(['Home'])
    );
  };

  getUser(id: number | string): any {
    return this._http.get(this.apiUrl + '/api/users/' + id)
    .map(res => res.json());
  };

  confirmUser(id: number | string, confirmationCode: string): any {
    let call = this.apiUrl + '/api/users/' + id + '/confirm/' + confirmationCode;
    return this._http.post(call, confirmationCode)
    .map(res => res.json());
  };

  getUserPosts(id: number | string): any {
    return this._http.get(this.apiUrl + '/api/users/' + id + '/posts')
    .map(res => res.json());
  };

  getUserComments(id: number | string): any {
    return this._http.get(this.apiUrl + '/api/users/' + id + '/comments')
    .map(res => res.json());
  };

  updateEmail(email: string, password: string): any {
    let headers = this.generateHeaders();
    let id = this._jwtHelper.decodeToken(this.getToken()).id;
    let call = this.apiUrl + '/api/users/' + id;
    console.log(password);
    let user = { email: email, current_password: password };
    return this._http.put(call, JSON.stringify(user), {
      headers: headers
    })
    .map(res => res.json());
  };

  updatePassword(password: string, new_password: string, new_password_confirmation: string): any {
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
