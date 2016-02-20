class CommentSerializer < ActiveModel::Serializer
  attributes :id, :body, :commentable_type, :commentable_id, :created_at
  has_one :vote_count do
    object.vote_total
  end
end
