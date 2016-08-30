class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :url, :user, :points, :comment_count, :created_at, :upvoted, :downvoted
  def id
    object.id
  end

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
