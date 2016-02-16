class Vote < ApplicationRecord
  around_save :update_points!
  belongs_to :votable, polymorphic: true
  belongs_to :user
  validates_presence_of :votable
  validates_presence_of :user_id
  validates :user_id, uniqueness: { scope: [:votable_type, :votable_id] }

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
end
