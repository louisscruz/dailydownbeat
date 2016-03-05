import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';
import {Injectable, OnInit} from 'angular2/core';
import {AuthHttp, tokenNotExpired, JwtHelper} from 'angular2-jwt';

import {User} from '../../datatypes/user/user';

@Injectable()
export class AuthService {
  private apiUrl: string = process.env.API_URL;
  public adminMode: boolean = false;
  public currentUser: User;

  constructor(
    private http: Http,
    private router: Router,
    private authHttp: AuthHttp,
    private _jwtHelper: JwtHelper
  ) { }
  saveJwt(jwt) {
    localStorage.setItem('auth_token', jwt);
  };
  deleteJwt() {
    localStorage.removeItem('auth_token');
  };
  setCurrentUser(user: User) {
    this.currentUser = user;
  };
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
          decodedToken.admin
        );
        return true;
      } else {
        this.currentUser = null;
      }
    }
    return false;
  }
  login(user) {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    return this.authHttp.post(this.apiUrl + '/api/login', JSON.stringify(user), {
      headers: header
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
  isSelf(id: number): boolean {
    if (this.currentUser) {
      return id === this.currentUser.id;
    }
    return false;
  }
}
