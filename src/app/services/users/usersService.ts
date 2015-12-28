import {Http, Headers} from 'angular2/http';
import {Router} from 'angular2/router';
import {Injectable} from 'angular2/core';
import {User} from '../../datatypes/user/user';

@Injectable()
export class UserService {
  constructor(public http: Http, private router: Router) { }
  postUser(user) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post('http://localhost:3000/users', JSON.stringify(user), {
      headers: headers
    })
    .map(res => res.json())
    .subscribe(
      res => alert('yippee'),
      err => console.log(err),
      () => this.router.navigate(['Home'])
    )
  }
}
