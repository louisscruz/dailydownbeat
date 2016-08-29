class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :url, :user, :points, :comment_count, :created_at, :upvoted
  def user
    { id: object.user.id, username: object.user.username }
  end
end
