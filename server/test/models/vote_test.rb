require 'test_helper'

class VoteTest < ActiveSupport::TestCase
  def setup
    FactoryGirl.create(:user)
    FactoryGirl.create(:post)
    User.create(id: 2, username: "johndoe2", email: "a@b.com", password: "testtest", password_confirmation: "testtest")
    @vote = Vote.create(votable: Post.first, user_id: User.first.id, polarity: 1)
    @downvote = Vote.create(votable: Post.first, user_id: User.first.id, polarity: -1)
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
    assert_not duplicate_vote.valid?
  end

  test "should allow several votes by one user on different objects" do
    duplicate_vote = @vote.dup
    duplicate_vote.votable = Post.second
    assert_not duplicate_vote.valid?
  end

  test "should increment tally of points for posts when upvote" do
    old_points = Post.first.points
    upvote = Vote.create(votable: Post.first, user_id: 2, polarity: 1)
    assert_equal old_points + 1, upvote.votable.points
  end

  test "should reduce tally of points for posts when downvote" do
    old_points = Post.first.points
    upvote = Vote.create(votable: Post.first, user_id: 2, polarity: -1)
    assert_equal old_points - 1, upvote.votable.points
  end

  test "should negate tally of points for posts when vote deleted" do
    old_points = Post.first.points
    upvote = Vote.create(votable: Post.first, user_id: 2, polarity: 1)
    assert_equal old_points + 1, upvote.votable.points
    upvote.destroy
    assert_equal old_points, upvote.votable.points
  end

  test "should reverse vote when change from upvote to downvote" do
    old_points = Post.first.points
    upvote = Vote.create(votable: Post.first, user_id: 2, polarity: 1)
    assert_equal old_points + 1, upvote.votable.points
    upvote.update_attribute(:polarity, -1)
    assert_equal old_points - 1, upvote.votable.points
  end

  test "should reverse vote when change from downvote to upvote" do
    old_points = Post.first.points
    upvote = Vote.create(votable: Post.first, user_id: 2, polarity: -1)
    assert_equal old_points - 1, upvote.votable.points
    upvote.update_attribute(:polarity, 1)
    assert_equal old_points + 1, upvote.votable.points
  end
end
