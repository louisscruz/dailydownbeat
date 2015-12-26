import {Http, Headers} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {User} from '../../datatypes/user/user';

@Injectable()
export class UserService {
  constructor(public http: Http) {
    console.log('Service Created!', http);
  }
}
