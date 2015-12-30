import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';
import {Injectable} from 'angular2/core';
import {AuthHttp} from 'angular2-jwt';

import {User} from '../../datatypes/user/user';

@Injectable()
export class AuthService {
  token: any;
  constructor(public http: Http, private router: Router, public authHttp: AuthHttp) {}
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
    //decoded = jwt_decode(this.token);
    var date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    if (date === null) {
      return false;
    }
    console.log(date);
    return (date.valueOf() > (new Date().valueOf()));
  }
  login(user: User[]) {
    console.log(user);
    console.log(JSON.stringify(user));
    this.authHttp.post('http://localhost:3000/login', JSON.stringify(user))
    .map(res => res.json())
    .subscribe(
      data => {
        this.saveJwt(data.auth_token);
      },
      err => console.log(err),
      () => this.router.navigate(['Home'])
    );
  }
  logout() {
    var jwt = localStorage.getItem('auth_token');
    var authHeader = new Headers();
    if (jwt) {
      authHeader.append('Authorization', jwt);
    }
    this.http.delete('http://localhost:3000/logout', {
      headers: authHeader
    })
    .map(res => res.json())
    .subscribe(
      data => this.deleteJwt(),
      err => console.log(err),
      () => this.router.navigate(['Login'])
    );
  }
  isLoggedIn() {
    //_jwt === localStorage.getItem('auth_token');
  }
}
