class Vote < ApplicationRecord
  after_destroy :remove_points!
  after_create :update_points!
  #after_update { update_points!(2) }
  #around_save :update_points!
  belongs_to :votable, polymorphic: true
  belongs_to :user
  validates_presence_of :votable
  validates_presence_of :user_id
  validates :user_id, uniqueness: { scope: [:votable_type, :votable_id] }
=begin
  def update_points!
    new_record = self.new_record?

    yield

    resource = self.votable
    p "----------------"
    p "resource is a new record: " + new_record.to_s
    p "resource currently has  " + resource.points.to_s + " points"
    resource.with_lock do
      p "resource vote polarity is " + self.polarity.to_s

      value = resource.points + self.polarity
      p "Changed points to " + value.to_s
      #if !new_record
        #value = resource.points + (self.polarity * 2)
      #end
      resource.update_attribute :points, value
    end
  end
=end

  def update_points!(v=1)
    resource = self.votable
    resource.with_lock do
      value = resource.points
      resource.update_attribute :points, value + (self.polarity * v)
    end
  end

  def remove_points!
    resource = self.votable
    resource.with_lock do
      value = resource.points
      resource.update_attribute :points, value - self.polarity
    end
  end
end
