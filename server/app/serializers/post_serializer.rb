class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :url, :created_at
  has_one :user do
    [username: object.user.username, user_id: object.user.id]
  end
  has_many :comments do
    object.comments.length
  end
  has_one :vote_count do
    object.vote_total
  end
end
