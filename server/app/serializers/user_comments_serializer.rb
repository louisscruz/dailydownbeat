class UserCommentsSerializer < ActiveModel::Serializer
  attributes :id, :body, :commentable_type, :commentable_id, :created_at, :points
end
