import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';
import {Injectable} from 'angular2/core';
import {User} from '../../datatypes/user/user';

var _jwt: string = '';
@Injectable()
export class AuthService {
  saveJwt(jwt) {
    if (jwt) {
      localStorage.setItem('auth_token', jwt);
      _jwt = jwt;
    }
  };
  deleteJwt() {
    localStorage.removeItem('auth_token');
  }
  constructor(public http: Http, private router: Router) { }
  login(user: User[]) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post('http://localhost:3000/login', JSON.stringify(user), {
      headers: headers
    })
    .map(res => res.json())
    .subscribe(
      data => {
        this.saveJwt(data.auth_token);
        _jwt = 'test';
      },
      err => alert(err),
      () => this.router.navigate(['Home'])
    );
  };
  logout() {
    var jwt = localStorage.getItem('auth_token');
    var authHeader = new Headers();
    if (jwt) {
      authHeader.append('Authorization', jwt)
    }
    this.http.delete('http://localhost:3000/logout', {
      headers: authHeader
    })
    .map(res => res.json())
    .subscribe(
      data => this.deleteJwt(),
      err => console.log(err),
      () => this.router.navigate(['Home'])
    );
  };
  isLoggedIn() {
    _jwt === localStorage.getItem('auth_token');
  }
}
