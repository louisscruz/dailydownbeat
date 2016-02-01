module Votable
  extend ActiveSupport::Concern

  included do
    has_many :votes, as: :votable
  end

  def vote_total
    self.votes.map { |p| p.polarity }.sum
  end

  def ranking
    age_in_minutes = ((Time.now - self.created_at) / 1.minute).round
    rank = self.vote_total.to_f / (age_in_minutes ** 2.5)
  end
end
