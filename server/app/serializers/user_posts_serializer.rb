class UserPostsSerializer < ActiveModel::Serializer
  attributes :id, :title, :url, :points, :comment_count, :created_at
end
