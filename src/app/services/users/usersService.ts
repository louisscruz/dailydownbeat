import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';
import {Injectable} from 'angular2/core';
import {User} from '../../datatypes/user/user';

@Injectable()
export class UserService {
  constructor(
    private _http: Http,
    private _router: Router) { }
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
}
