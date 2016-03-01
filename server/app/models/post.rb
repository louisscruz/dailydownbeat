class Post < ApplicationRecord
  include Votable

  belongs_to :user
  has_many :comments, as: :commentable
  validate :title_prepend
  validates :title, presence: true
  validates :url, presence: true, format: { with: URI::regexp(%w(http https)) }
  validates :user_id, presence: true

  def title_prepend
    prepends = ["show dd", "job", "ask dd"]
    if !type && prepends.any? { |w| title.downcase =~ /#{w}/ }
      errors.add(:title, 'Regular posts may not have prepends')
    elsif type == "show" && title[0, 9] != "Show DD: "
      errors.add(:title, "Show DD posts must begin with 'Show DD: '")
    elsif type == "job" && title[0, 5] != "Job: "
      errors.add(:title, "Job posts must begin with 'Job: '")
    elsif type == "ask" && title[0, 8] != "Ask DD: "
      errors.add(:title, "Ask DD posts must begin with 'Ask DD: '")
    end
  end

  private
end
