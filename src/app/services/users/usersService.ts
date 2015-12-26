import {Http, Headers} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {User} from '../../datatypes/user/user';

@Injectable()
export class UserService {
  constructor(public http: Http) {
    console.log('Service Created!', http);
  }
  postUser(user) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post('http://localhost:3000/users', JSON.stringify(user), {
      headers: headers
    })
    .map(res => res.json())
  }
}
