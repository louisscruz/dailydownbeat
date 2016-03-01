class VotesSerializer < ActiveModel::Serializer
  attributes :votable_type, :votable_id
end
