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
  public admin: boolean = false;
  public currentUser: User;
  public adminMode: boolean = false;
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
    if (token) {
      let decodedToken = this._jwtHelper.decodeToken(token);
      this.loggedIn = tokenNotExpired(null, token);
      this.userId = decodedToken.id;
      this.username = decodedToken.username;
      this.admin = decodedToken.admin;
      return this.loggedIn;
    }
    return false;
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
    header.append('Content-Type', 'application/json');
    header.append('Authorization', token);
    return this.authHttp.delete('http://localhost:3000/api/logout', {
      headers: header
    });
    this.deleteJwt();
  }
  getUserId() {
    let token = localStorage.getItem('auth_token');
    this.userId = this._jwtHelper.decodeToken(token).id;
    return this.userId;
  }
  isAdmin() {
    let token = localStorage.getItem('auth_token');
    if (token) {
      this.admin = this._jwtHelper.decodeToken(token).admin;
      return this.admin;
    }
    return false;
  }
  setCurrentUser(user) {
    this.currentUser = user;
  }
  getAdminMode() {
    if (this.adminMode) {
      return true;
    }
    return false;
  }
}
