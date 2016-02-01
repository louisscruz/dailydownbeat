class Comment < ApplicationRecord
  include Votable
  
  belongs_to :commentable, polymorphic: true
  belongs_to :user
end
