export class Post {
  constructor(
    public id: number,
    public title: string,
    public url: string,
    public created_at: number,
    public user: Array<any>,
    public comment_count: number,
    public points: number,
    public kind: string,
    public upvoted: boolean = false,
    public downvoted: boolean = false
  ) { }
}
