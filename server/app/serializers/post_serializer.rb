class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :url
  has_one :user
  has_many :comments
end
