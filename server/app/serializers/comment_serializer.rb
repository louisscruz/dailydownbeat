class CommentSerializer < ActiveModel::Serializer
  attributes :id, :body, :commentable_type, :commentable_id, :user, :created_at
  def user
    { id: object.user.id, username: object.user.username }
  end
end
