export class User {
  constructor(
    public id: number,
    public auth_token: string,
    public username: string,
    public email: string,
    public bio: string,
    public confirmed: boolean,
    public admin: boolean,
    public points: number
  ) { }
}
