import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';
import {Injectable} from 'angular2/core';
import {AuthHttp, JwtHelper, AuthConfig} from 'angular2-jwt';

import {User} from '../../datatypes/user/user';

@Injectable()
export class AuthService {
  token: any;
  jwtHelper: JwtHelper = new JwtHelper();
  constructor(public http: Http, private router: Router, public authHttp: AuthHttp) { }
  saveJwt(jwt) {
    if (jwt) {
      localStorage.setItem('auth_token', jwt);
      this.token = localStorage.getItem('auth_token');
    }
  };
  deleteJwt() {
    localStorage.removeItem('auth_token');
    this.token = localStorage.getItem('auth_token');
  };
  isAuth() {
    var decoded: any;
    //decoded = this.jwtHelper(this.token);
    var date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    if (date === null) {
      return false;
    }
    console.log(date);
    return (date.valueOf() > (new Date().valueOf()));
  }
  login(user) {
    console.log('inside authService.login');
    var header = new Headers();
    console.log(header);
    header.append('Content-Type', 'application/json');
    console.log(JSON.stringify(user));


    return this.authHttp.post('http://localhost:3000/api/login', JSON.stringify(user), {
      headers: header
    })
    .map(res => {
      console.log(res);
      return res.json();
    });
  }
  logout() {
    /*var jwt = localStorage.getItem('auth_token');
    var authHeader = new Headers();
    if (jwt) {
      authHeader.append('Authorization', jwt);
    }*/
    var token = localStorage.getItem('auth_token');
    var header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', token);
    console.log(token);

    return this.authHttp.delete('http://localhost:3000/api/logout', {
      headers: header
    })
    .map(res => res.json());
    /*.subscribe(
      data => this.deleteJwt(),
      err => console.log(err),
      () => this.router.navigate(['Login'])
    );*/
  }
  isLoggedIn() {
    //_jwt === localStorage.getItem('auth_token');
  }
}
