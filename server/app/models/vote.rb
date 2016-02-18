class Vote < ApplicationRecord
  after_destroy { update_points!(-1)}
  after_create :update_points!
  after_update { update_points!(2) }
  belongs_to :votable, polymorphic: true
  belongs_to :user
  validates_presence_of :votable
  validates_presence_of :user_id
  validates :user_id, uniqueness: { scope: [:votable_type, :votable_id] }

  def update_points!(i=1)
    self.with_lock do
      resource = self.votable
      value = resource.points
      resource.update_attribute :points, value + (self.polarity * i)
    end
  end
end
