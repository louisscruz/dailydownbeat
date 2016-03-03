class Post < ApplicationRecord
  include Votable

  after_create :update_user_points
  after_destroy { update_user_points(-1)}
  belongs_to :user
  has_many :comments, as: :commentable
  validate :title_prepend
  validates :title, presence: true, length: { minimum: 3, maximum: 80 }
  validates :url, presence: true, format: { with: URI::regexp(%w(http https)) }
  validates :user_id, presence: true

  private

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

  def update_user_points(v=1)
    new_points = self.user.points + v
    user.update_attribute :points, new_points
  end
end
