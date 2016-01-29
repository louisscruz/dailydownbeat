export class Post {
  constructor(
    public id: number,
    public title: string,
    public url: string,
    public user: string,
    public comments: Array<any>
  ) { }
}
