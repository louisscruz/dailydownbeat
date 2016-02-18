class Vote < ApplicationRecord
  after_destroy :remove_points!
  after_create :update_points!
  after_update { update_points!(true) }
  after_update :log_update
  belongs_to :votable, polymorphic: true
  belongs_to :user
  validates_presence_of :votable
  validates_presence_of :user_id
  validates :user_id, uniqueness: { scope: [:votable_type, :votable_id] }

  def update_points!(actual_update=false)
    resource = self.votable
    resource.with_lock do
      value = resource.points
      if actual_update
        resource.update_attribute :points, value + (self.polarity * 2)
      else
        resource.update_attribute :points, value + self.polarity
      end
    end
  end

  def remove_points!
    resource = self.votable
    resource.with_lock do
      value = resource.points
      resource.update_attribute :points, value - self.polarity
    end
  end

  def log_update
    p "attempted update"
  end
end
