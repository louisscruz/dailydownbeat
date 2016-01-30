require 'test_helper'

class VoteTest < ActiveSupport::TestCase
  def setup
    FactoryGirl.create(:user)
    FactoryGirl.create(:post)
    @vote = Vote.create(votable: Post.first, user_id: User.first.id)
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

  test "should not allow multiple votes" do
    duplicate_vote = @vote.dup
    @vote.save
    assert_not duplicate_vote.valid?
  end
end
