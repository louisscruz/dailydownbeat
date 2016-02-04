class CommentSerializer < ActiveModel::Serializer
  attributes :id, :body, :commentable_type, :commentable_id, :created_at, :vote_count
  has_one :user do
    [username: object.user.username, user_id: object.user.id]
  end
  has_one :vote_count do
    object.vote_total
  end
end
