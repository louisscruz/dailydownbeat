export class User {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  constructor(username: string, email: string, password: string, passwordConfirmation: string) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.passwordConfirmation = passwordConfirmation;
  }
}
