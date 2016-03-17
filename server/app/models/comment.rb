class Comment < ApplicationRecord
  include Votable

  after_create :update_comment_count
  after_destroy { update_comment_count(-1) }
  belongs_to :commentable, polymorphic: true
  belongs_to :user
  has_many :comments, :as => :commentable, :dependent => :destroy

  private

  def update_comment_count(v=1)
    parent = self.commentable
    parent_value = parent.comment_count
    parent.update_attribute :comment_count, parent_value + v
    if parent.instance_of? Comment
      while parent.instance_of? Comment
        parent = parent.commentable
      end
      parent_value = parent.comment_count
      parent.update_attribute :comment_count, parent_value + v
    end
  end
end
