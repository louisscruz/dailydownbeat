class Post < ApplicationRecord
  include Votable

  after_create :update_user_points
  after_destroy { update_user_points(-1)}
  before_validation :filter_url
  before_validation :title_prepend
  belongs_to :user
  has_many :comments, as: :commentable, :dependent => :destroy
  validates :title, presence: true
  validates_presence_of :url, :unless => :ask_post?
  validates_format_of :url, with: URI::regexp(%w(http https)), :unless => :ask_post?
  validates :user_id, presence: true
  validates_length_of :title, :minimum => 3, :maximum => 80

  private

  def title_prepend
    prepends = ["show dd", "job", "ask dd"]
    if kind == "post" && prepends.any? { |w| title.downcase =~ /#{w}/ }
      errors.add(:title, 'Regular posts may not have prepends')
    elsif kind == "show" && title[0, 9] != "Show DD: "
      errors.add(:title, "Show DD posts must begin with 'Show DD: '")
    elsif kind == "job" && title[0, 5] != "Job: "
      errors.add(:title, "Job posts must begin with 'Job: '")
    elsif kind == "ask" && title[0, 8] != "Ask DD: "
      errors.add(:title, "Ask DD posts must begin with 'Ask DD: '")
    end
  end

  def update_user_points(v=1)
    new_points = self.user.points + v
    user.update_attribute :points, new_points
  end

  #def default_ask_url
    #self.url = "http://dailydownbeat.com/posts/" + self.id.to_s if self.kind == "ask"
  #end
  def ask_post?
    self.kind == "ask"
  end

  def filter_url
    self.url = nil if self.kind == "ask"
  end
end
