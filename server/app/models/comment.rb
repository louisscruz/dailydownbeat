class Comment < ApplicationRecord
  include Votable

  after_create :update_comment_count
  after_destroy { update_comment_count(-1) }
  belongs_to :commentable, polymorphic: true
  belongs_to :user

  def update_comment_count(v=1)
    resource = self.commentable
    value = resource.comment_count
    resource.update_attribute :comment_count, value + v
  end
end
