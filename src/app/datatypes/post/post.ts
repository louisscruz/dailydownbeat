export class Post {
  constructor(
    public id: number,
    public title: string,
    public url: string,
    public user: Array<any>,
    public comments: number
  ) { }
}
