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
end
