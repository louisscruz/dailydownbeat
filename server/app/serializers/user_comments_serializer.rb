class UserCommentsSerializer < ActiveModel::Serializer
  attributes :id, :body, :points, :commentable_type, :commentable_id, :created_at
end
