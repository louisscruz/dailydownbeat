class CommentSerializer < ActiveModel::Serializer
  attributes :id, :body, :commentable_type, :commentable_id
  has_one :user do
    [username: object.user.username, user_id: object.user.id]
  end
end
