class UserCommentsSerializer < ActiveModel::Serializer
  attributes :id, :body, :points, :user, :commentable_type, :commentable_id, :commentable_user, :created_at
  def commentable_user
    { id: object.commentable.user.id, username: object.commentable.user.username }
  end
  def user
    { id: object.user.id, username: object.user.username }
  end
end
