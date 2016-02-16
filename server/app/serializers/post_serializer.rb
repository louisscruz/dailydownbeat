class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :url, :points, :comment_count, :created_at
  has_one :user do
    [username: object.user.username, user_id: object.user.id]
  end
end
