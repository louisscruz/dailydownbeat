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

  #def upvoted(user)
    #if user
      #user_upvotes = Vote.where(user_id: this_user.id, polarity: 1)
      #user_upvotes.any? { |user_vote| user_vote.votable_id == self.id }
    #else
      #false
    #end
  #end

  #def downvoted(user)
    #if user
      #user_downvotes = Vote.where(user_id: this_user.id, polarity: -1)
      #user_downvotes.any? { |user_vote| user_vote.votable_id == self.id }
    #else
      #false
    #end
  #end

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
