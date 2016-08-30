class CommentSerializer < ActiveModel::Serializer
  attributes :id, :body, :commentable_type, :commentable_id, :user, :created_at, :comment_count, :points, :upvoted, :downvoted
  has_many :comments
  def user
    { id: object.user.id, username: object.user.username }
  end

  def upvoted
    if scope
      user_upvotes = Vote.where(user_id: this_user.id, polarity: 1)
      user_upvotes.any? { |user_vote| user_vote.votable_id == self.id }
    else
      false
    end
  end

  def downvoted
    if scope
      user_downvotes = Vote.where(user_id: this_user.id, polarity: -1)
      user_downvotes.any? { |user_vote| user_vote.votable_id == self.id }
    else
      false
    end
  end
end
