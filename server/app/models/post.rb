class Post < ApplicationRecord
  validates :title, presence: true
  validates :url, presence: true
  has_many :comments, as: :commentable
  belongs_to :user
end
