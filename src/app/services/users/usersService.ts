import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';
import {Injectable} from 'angular2/core';
import {User} from '../../datatypes/user/user';

import {JwtHelper} from 'angular2-jwt';

@Injectable()
export class UserService {
  private apiUrl: string = process.env.API_URL;
  constructor(
    private _http: Http,
    private _router: Router,
    private _jwtHelper: JwtHelper
  ) {}
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
  }
  getUserPosts(id: number | string): any {
    return this._http.get(this.apiUrl + '/api/users/' + id + '/posts')
    .map(res => res.json());
  }
  getUserComments(id: number | string): any {
    return this._http.get(this.apiUrl + '/api/users/' + id + '/comments')
    .map(res => res.json());
  }
  updateEmail(email: string, password: string): any {
    let token = localStorage.getItem('auth_token');
    let header = new Headers();
    let id = this._jwtHelper.decodeToken(token).id;
    header.append('Content-Type', 'application/json');
    header.append('Authorization', token);
    let call = this.apiUrl + '/api/users/' + id;
    return this._http.put(call, JSON.stringify({email, password}), {
      headers: header
    })
    .map(res => res.json());
  }
  updatePassword(password: string, new_password: string, new_password_confirmation: string): any {
    let token = localStorage.getItem('auth_token');
    let header = new Headers();
    let id = this._jwtHelper.decodeToken(token).id;
    header.append('Content-Type', 'application/json');
    header.append('Authorization', token);
    let call = this.apiUrl + '/api/users/' + id + '/update_password';
    return this._http
    .patch(call, JSON.stringify({password, new_password, new_password_confirmation}), {
      headers: header
    })
    .map(res => res.json());
  }
}
