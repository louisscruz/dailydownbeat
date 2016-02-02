export class Post {
  constructor(
    public id: number,
    public title: string,
    public url: string,
    public created_at: number,
    public user: Array<any>,
    public comments: number,
    public vote_count: number
  ) { }
}
