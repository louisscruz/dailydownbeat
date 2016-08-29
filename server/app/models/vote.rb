class Vote < ApplicationRecord
  after_destroy { update_points!(-1)}
  after_create :update_points!
  after_update { update_points!(2) }
  before_validation :remove_opposite_vote
  belongs_to :votable, polymorphic: true
  belongs_to :user
  validates_presence_of :votable
  validates_presence_of :user_id
  validates :user_id, uniqueness: { scope: [:votable_type, :votable_id] }
  validate :may_not_vote_for_self
  validate :user_confirmed
  validate :user_allowed_downvote

  private

  def may_not_vote_for_self
    return unless self.votable
    errors.add(:user_id, "can't vote for user's own votable") unless self.user_id != self.votable.user.id
  end

  def update_points!(i=1)
    self.with_lock do
      resource = self.votable
      user = resource.user
      resource.update_attribute :points, resource.points + (self.polarity * i)
      user.update_attribute :points, user.points + (self.polarity * i)
    end
  end

  def user_confirmed
    unless self.user && self.user.confirmed == true
      errors.add(:user, "must be confirmed to make posts.")
    end
  end

  def user_allowed_downvote
    if self.polarity == -1 && (self.user.present? && self.user.points < 50)
      errors.add(:user, "must have more than 50 points to downvote")
    end
  end

  def remove_opposite_vote
    return if self.votable.nil?
    votable_votes = self.votable.votes
    opposite_vote = votable_votes.find do |vote|
      self.polarity != vote.polarity && vote.user_id == self.user_id
    end
    opposite_vote.destroy if opposite_vote
  end
end
