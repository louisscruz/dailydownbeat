class UserCommentsSerializer < ActiveModel::Serializer
  attributes :id, :body, :points, :user, :commentable_type, :commentable_id, :commentable_user, :created_at, :upvoted, :downvoted

  def id
    object.id
  end

  def commentable_user
    { id: object.commentable.user.id, username: object.commentable.user.username }
  end

  def user
    { id: object.user.id, username: object.user.username }
  end

  def upvoted
    if scope
      user_comment_upvotes = Vote.where(user_id: this_user.id, votable_type: "Comment", polarity: 1)
      user_comment_upvotes.any? { |user_vote| user_vote.votable_id == self.id }
    else
      false
    end
  end

  def downvoted
    if scope
      user_comment_downvotes = Vote.where(user_id: this_user.id, votable_type: "Comment", polarity: -1)
      user_comment_downvotes.any? { |user_vote| user_vote.votable_id == self.id }
    else
      false
    end
  end
end
