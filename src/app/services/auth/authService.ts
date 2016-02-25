import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';
import {Injectable, OnInit} from 'angular2/core';
import {AuthHttp, tokenNotExpired, JwtHelper} from 'angular2-jwt';

import {User} from '../../datatypes/user/user';

@Injectable()
export class AuthService {
  public loggedIn: boolean;
  public token: string;
  public userId: number;
  public username: string;
  constructor(
    private http: Http,
    private router: Router,
    private authHttp: AuthHttp,
    private _jwtHelper: JwtHelper) { }
  saveJwt(jwt) {
    localStorage.setItem('auth_token', jwt);
    this.token = localStorage.getItem('auth_token');
  };
  deleteJwt() {
    localStorage.removeItem('auth_token');
    this.token = localStorage.getItem('auth_token');
  };
  isAuth(): boolean {
    let token = localStorage.getItem('auth_token');
    this.loggedIn = tokenNotExpired(null, token);
    if (token) {
      this.userId = this._jwtHelper.decodeToken(token).id;
      this.username = this._jwtHelper.decodeToken(token).username;
    }
    return this.loggedIn;
  }
  login(user) {
    let header = new Headers();
    header.append('Content-Type', 'application/json');

    return this.authHttp.post('http://localhost:3000/api/login', JSON.stringify(user), {
      headers: header
    })
    .map(res => res.json());
  }
  logout() {
    let token = localStorage.getItem('auth_token');
    let header = new Headers();
    console.log(token);
    header.append('Content-Type', 'application/json');
    header.append('Authorization', token);
    return this.authHttp.delete('http://localhost:3000/api/logout', {
      headers: header
    });
  }
  getUserId() {
    let token = localStorage.getItem('auth_token');
    this.userId = this._jwtHelper.decodeToken(token).id;
    return this.userId;
  }
}
