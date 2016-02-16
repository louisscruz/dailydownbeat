class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :url, :points, :created_at
  has_one :user do
    [username: object.user.username, user_id: object.user.id]
  end
  has_many :comments do
    object.comments.length
  end
end
