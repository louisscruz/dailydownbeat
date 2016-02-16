require 'test_helper'

class VoteTest < ActiveSupport::TestCase
  def setup
    FactoryGirl.create(:user)
    FactoryGirl.create(:post)
    @vote = Vote.create(votable: Post.first, user_id: User.first.id, polarity: 1)
  end

  test "should be valid" do
    assert @vote.valid?
  end

  test "should have a votable" do
    @vote.votable = nil
    assert_not @vote.valid?
  end

  test "should have a user_id" do
    @vote.user_id = "  "
    assert_not @vote.valid?
  end

  test "should not allow multiple votes by one user" do
    duplicate_vote = @vote.dup
    duplicate_vote.polarity = -1
    @vote.save
    assert_not duplicate_vote.valid?
  end

  test "should allow several votes by one user on different objects" do
    duplicate_vote = @vote.dup
    duplicate_vote.votable = Post.second
    @vote.save
    assert_not duplicate_vote.valid?
  end

  test "should increment tally of points for posts when upvote" do
    old_points = @vote.votable.points
    @vote.save
    assert_equal old_points + 1, @vote.votable.points
  end

  test "should reduce tally of points for posts when downvote" do
    old_points = @vote.votable.points
    @vote.polarity = -1
    @vote.save
    post = Post.find(@vote.votable_id)
    assert_equal old_points - 1, post.points
  end
=begin
  test "should correctly change tally on update of vote from down to up" do
    old_points = @vote.votable.points
    @vote.polarity = -1
    @vote.save
    post = Post.find(@vote.votable_id)
    assert_equal old_points - 1, post.points
    @vote.update_attribute :polarity, 1
    @vote.reload
    assert_equal old_points + 1, @vote.votable.points
  end

  test "should correctly change tally on update of vote from up to down" do
    old_points = @vote.votable.points
    @vote.save
    post = Post.find(@vote.votable_id)
    assert_equal old_points + 1, post.points
    @vote.update_attribute :polarity, -1
    @vote.reload
    assert_equal old_points - 1, @vote.votable.points
  end
=end
end
