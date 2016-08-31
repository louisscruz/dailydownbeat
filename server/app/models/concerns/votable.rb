module Votable
  extend ActiveSupport::Concern

  included do
    has_many :votes, as: :votable
  end

  def vote_total
    self.votes.map { |p| p.polarity }.sum
  end

  def ranking
    age_in_hours = ((Time.now - self.created_at) / 1.hour).round
    rank = (self.points.to_f + 1) / ((age_in_hours + 2) ** 1.8)
  end
end
