export class User {
  constructor(
    public id: number,
    public auth_token: string,
    public username: string,
    public email: string,
    public bio: string,
    confirmed: boolean,
    admin: boolean
  ) { }
}
