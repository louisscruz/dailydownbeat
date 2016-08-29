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

  def upvoted
    this_user = find_this_user
    if this_user
      this_user.votes.any? { |user_vote| user_vote.polarity == 1 && user_vote.votable_id == self.id }
    else
      false
    end
  end

  def downvoted
    this_user = find_this_user
    if this_user
      this_user.votes.any? { |user_vote| user_vote.polarity == -1 && user_vote.votable_id == self.id }
    else
      false
    end
  end

  def find_this_user
    (1..Kernel.caller.length).each do |n|
      RubyVM::DebugInspector.open do |i|
        this_user = eval "this_user rescue nil", i.frame_binding(n)
        return this_user unless this_user.nil?
      end
    end
    return nil
  end
end
