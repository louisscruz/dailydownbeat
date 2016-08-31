class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :url, :user, :points, :comment_count, :created_at, :upvoted, :downvoted

  def id
    object.id
  end

  def user
    { id: object.user.id, username: object.user.username }
  end

  def upvoted
    #p scope
    if scope
      user_post_upvotes = Vote.where(user_id: this_user.id, votable_type: "Post", polarity: 1)
      user_post_upvotes.any? { |vote| vote.votable_id == object.id }
    else
      false
    end
  end

  def downvoted
    if scope
      user_post_downvotes = Vote.where(user_id: this_user.id, votable_type: "Post", polarity: -1)
      user_post_downvotes.any? { |vote| vote.votable_id == object.id }
    else
      false
    end
  end
end
