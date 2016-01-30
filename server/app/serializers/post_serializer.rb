class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :url
  has_one :user do
    object.user.username
  end
  has_many :comments do
    object.comments.length
  end
end
