import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';
import {Injectable} from 'angular2/core';
import {User} from '../../datatypes/user/user';

import {JwtHelper} from 'angular2-jwt';

@Injectable()
export class UserService {
  constructor(
    private _http: Http,
    private _router: Router,
    private _jwtHelper: JwtHelper
  ) { }
  postUser(user) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._http.post('http://localhost:3000/users', JSON.stringify(user), {
      headers: headers
    })
    .map(res => res.json())
    .subscribe(
      res => alert('yippee'),
      err => console.log(err),
      () => this._router.navigate(['Home'])
    );
  }
  getUser(id: number | string) {
    return this._http.get('http://localhost:3000/api/users/' + id)
    .map(res => res.json());
  }
  confirmUser(id: number | string, confirmationCode: string) {
    return this._http.post('http://localhost:3000/api/users/' + id + '/confirm/' + confirmationCode, confirmationCode)
    .map(res => res.json());
  }
  getUserPosts(id: number | string) {
    return this._http.get('http://localhost:3000/api/users/' + id + '/posts')
    .map(res => res.json());
  }
  getUserComments(id: number | string) {
    return this._http.get('http://localhost:3000/api/users/' + id + '/comments')
    .map(res => res.json());
  }
  updateEmailAddress(id: number, newEmail) {
    return this._http.get('http://localhost:3000/api/users/' + id + '/update_email', newEmail)
    .map(res =>res.json());
  }
  updatePassword(password: string, new_password: string, new_password_confirmation: string) {
    let token = localStorage.getItem('auth_token');
    let header = new Headers();
    let id = this._jwtHelper.decodeToken(token).id;
    header.append('Content-Type', 'application/json');
    header.append('Authorization', token);
    return this._http.patch('http://localhost:3000/api/users/' + id + '/update_password', JSON.stringify({password, new_password, new_password_confirmation}), {
      headers: header
    })
    .map(res => res.json());
  }
}
