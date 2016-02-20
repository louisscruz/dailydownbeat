export class Comment {
  constructor(
    public id: number,
    public user_id: number,
    public body: string,
    public points: number,
    public commentable_type: string,
    public commentable_id: number,
    public comment_count: number,
    public created_at: number,
    public updated_at: number
  ) { }
}
