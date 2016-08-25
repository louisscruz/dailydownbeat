require 'test_helper'

class VoteTest < ActiveSupport::TestCase
  def setup
    @first_user = User.create(id: 1, username: "johndoe", email: "a@b.com", password: "testtest", password_confirmation: "testtest", confirmed: true)
    @second_user = User.create(id: 2, username: "johndoe2", email: "a@b4.com", password: "testtest", password_confirmation: "testtest", confirmed: true)
    @third_user = User.create(id: 3, username: "johndoe3", email: "a@b3.com", password: "testtest", password_confirmation: "testtest", confirmed: true)
    @first_post = Post.create(title: "testtest", user_id: 1, url: "http://www.google.com")
    @second_post = Post.create(title: "testtest", user_id: 2, url: "http://www.google.com")
    @third_post = Post.create(title: "testtest", user_id: 3, url: "http://www.google.com")
    @first_comment = Comment.create(commentable: @first_post, user_id: 1, body: "Comment")
    @second_comment = Comment.create(commentable: @first_post, user_id: 2, body: "Comment")
    @third_comment = Comment.create(commentable: @first_comment, user_id: 3, body: "Comment")
    @upvote = Vote.create(votable: @first_post, user_id: @second_user.id, polarity: 1)
    @downvote = Vote.create(votable: @second_post, user_id: @first_user.id, polarity: -1)
    @first_comment.reload
    @second_comment.reload
    @third_comment.reload
    @first_post.reload
    @second_post.reload
    @third_post.reload
    @first_user.reload
    @second_user.reload
    @third_user.reload
  end

  test "only a confirmed user should be allowed to vote on posts" do
    @first_user.update_attribute(:confirmed, false)
    @first_user.reload
    upvote = Vote.create(votable: @third_post, user_id: @first_user.id, polarity: 1)
    assert_not upvote.valid?
    downvote = Vote.create(votable: @third_post, user_id: @first_user.id, polarity: -1)
    assert_not upvote.valid?
  end

  test "only a confirmed user should be allowed to vote on comments" do
    @first_user.update_attribute(:confirmed, false)
    @first_user.reload
    upvote = Vote.create(votable: @third_comment, user_id: @first_user.id, polarity: 1)
    assert_not upvote.valid?
    downvote = Vote.create(votable: @third_comment, user_id: @first_user.id, polarity: -1)
    assert_not upvote.valid?
  end

  test "upvote should be valid" do
    assert @upvote.valid?
  end

  test "downvote should be valid" do
    assert @downvote.valid?
  end

  test "should have a votable" do
    @upvote.votable = nil
    assert_not @upvote.valid?
  end

  test "should have a user_id" do
    @upvote.user_id = nil
    assert_not @upvote.valid?
  end

  test "should not allow multiple votes by one user on the same post" do
    duplicate_vote = @upvote.dup
    duplicate_vote.polarity = -1
    assert_not duplicate_vote.valid?
  end

  test "should not allow user to upvote own post" do
    self_vote = Vote.create(votable: @first_post, user_id: @first_user.id, polarity: 1)
    assert_not self_vote.valid?
  end

  test "should allow several votes by one user on different posts" do
    new_vote = Vote.create(votable: @third_post, user_id: @second_user.id, polarity: 1)
    assert new_vote.valid?
  end

  test "should increment tally of points for posts when upvote" do
    old_points = @first_post.points
    upvote = Vote.create(votable: @first_post, user_id: 3, polarity: 1)
    @first_post.reload
    assert_equal old_points + 1, upvote.votable.points
  end

  test "should reduce tally of points for posts when downvote" do
    old_points = @second_post.points
    downvote = Vote.create(votable: @second_post, user_id: 3, polarity: -1)
    @second_post.reload
    assert_equal old_points - 1, downvote.votable.points
  end

  test "should negate tally of points for posts when vote deleted" do
    old_points = @first_post.points
    @upvote.destroy
    @first_post.reload
    assert_equal old_points - 1, @first_post.points
  end

  test "should reverse vote when change from upvote to downvote" do
    old_points = @first_post.points
    @upvote.update_attribute(:polarity, -1)
    @first_post.reload
    assert_equal old_points - 2, @upvote.votable.points
  end

  test "should reverse vote when change from downvote to upvote" do
    old_points = @second_post.points
    @downvote.update_attribute(:polarity, 1)
    @second_post.reload
    assert_equal old_points + 2, @downvote.votable.points
  end

  test "upvote on post should increment poster's points" do
    old_points = @second_user.points
    vote = Vote.create(votable: @second_post, user_id: @third_user.id, polarity: 1)
    @second_user.reload
    assert_equal old_points + 1, @second_user.points
  end

  test "downvote on post should decrement poster's points" do
    old_points = @second_user.points
    vote = Vote.create(votable: @second_post, user_id: @third_user.id, polarity: -1)
    @second_user.reload
    assert_equal old_points - 1, @second_user.points
  end

  test "deletion of upvote on post should remove from poster's points" do
    old_points = @first_user.points
    @upvote.destroy
    @first_user.reload
    assert_equal old_points - 1, @first_user.points
  end

  test "deletion of downvote of post should remove from poster's points" do
    old_points = @second_user.points
    @downvote.destroy
    @second_user.reload
    assert_equal old_points + 1, @second_user.points
  end

  test "upvote to downvote of post should decrement post's user by two" do
    old_points = @first_user.points
    @upvote.update_attribute :polarity, -1
    @first_user.reload
    assert_equal old_points - 2, @first_user.points
  end

  test "downvote to upvote of post should increment post's user by two" do
    old_points = @second_user.points
    @downvote.update_attribute :polarity, 1
    @second_user.reload
    assert_equal old_points + 2, @second_user.points
  end

  test "should allow for comments to be votables" do
    comment_vote = Vote.create(votable: @first_comment, user_id: @second_user.id, polarity: 1)
    assert comment_vote.valid?
  end

  test "should not be able to vote on one's own comment" do
    comment_vote = Vote.create(votable: @first_comment, user_id: @first_user.id, polarity: 1)
    assert_not comment_vote.valid?
  end

  test "should increment comment's points when given upvote" do
    old_points = @first_comment.points
    comment_vote = Vote.create(votable: @first_comment, user_id: @second_user.id, polarity: 1)
    @first_comment.reload
    assert_equal old_points + 1, @first_comment.points
  end

  test "should decrement comment's points when given downvote" do
    old_points = @first_comment.points
    comment_vote = Vote.create(votable: @first_comment, user_id: @second_user.id, polarity: -1)
    @first_comment.reload
    assert_equal old_points - 1, @first_comment.points
  end

  test "should negate vote on comment when upvote deleted" do
    old_points = @first_comment.points
    comment_vote = Vote.create(votable: @first_comment, user_id: @second_user.id, polarity: 1)
    @first_comment.reload
    assert_equal old_points + 1, @first_comment.points
    comment_vote.destroy
    @first_comment.reload
    assert_equal old_points, @first_comment.points
  end

  test "should negate vote on comment when downvote deleted" do
    old_points = @first_comment.points
    comment_vote = Vote.create(votable: @first_comment, user_id: @second_user.id, polarity: -1)
    @first_comment.reload
    assert_equal old_points - 1, @first_comment.points
    comment_vote.destroy
    @first_comment.reload
    assert_equal old_points, @first_comment.points
  end

  test "should decrement by two when upvote to downvote on comment" do
    old_points = @first_comment.points
    comment_vote = Vote.create(votable: @first_comment, user_id: @second_user.id, polarity: 1)
    @first_comment.reload
    assert_equal old_points + 1, @first_comment.points
    comment_vote.update_attribute :polarity, -1
    @first_comment.reload
    assert_equal old_points - 1, @first_comment.points
  end

  test "should increment by two when downvote to upvote on comment" do
    old_points = @first_comment.points
    comment_vote = Vote.create(votable: @first_comment, user_id: @second_user.id, polarity: -1)
    @first_comment.reload
    assert_equal old_points - 1, @first_comment.points
    comment_vote.update_attribute :polarity, 1
    @first_comment.reload
    assert_equal old_points + 1, @first_comment.points
  end

  test "should increment commenter's points when upvoted" do
    old_points = @first_user.points
    comment_vote = Vote.create(votable: @first_comment, user_id: @second_user.id, polarity: 1)
    @first_user.reload
    assert_equal old_points + 1, @first_user.points
  end

  test "should decrement commenter's points when downvoted" do
    old_points = @first_user.points
    comment_vote = Vote.create(votable: @first_comment, user_id: @second_user.id, polarity: -1)
    @first_user.reload
    assert_equal old_points - 1, @first_user.points
  end

  test "should negate commenter's points when upvote deleted" do
    old_points = @first_user.points
    comment_vote = Vote.create(votable: @first_comment, user_id: @second_user.id, polarity: 1)
    @first_user.reload
    assert_equal old_points + 1, @first_user.points
    comment_vote.destroy
    @first_user.reload
    assert_equal old_points, @first_user.points
  end

  test "should negate commenter's points when downvote deleted" do
    old_points = @first_user.points
    comment_vote = Vote.create(votable: @first_comment, user_id: @second_user.id, polarity: -1)
    @first_user.reload
    assert_equal old_points - 1, @first_user.points
    comment_vote.destroy
    @first_user.reload
    assert_equal old_points, @first_user.points
  end

  test "should decrement commenter's points by two when upvote to downvote" do
    old_points = @first_user.points
    comment_vote = Vote.create(votable: @first_comment, user_id: @second_user.id, polarity: 1)
    @first_user.reload
    assert_equal old_points + 1, @first_user.points
    comment_vote.update_attribute :polarity, -1
    @first_user.reload
    assert_equal old_points - 1, @first_user.points
  end

  test "should increment commenter's points by two when downvote to upvote" do
    old_points = @first_user.points
    comment_vote = Vote.create(votable: @first_comment, user_id: @second_user.id, polarity: -1)
    @first_user.reload
    assert_equal old_points - 1, @first_user.points
    comment_vote.update_attribute :polarity, +1
    @first_user.reload
    assert_equal old_points + 1, @first_user.points
  end

  test "should retain commenter's points and destroy vote when A creates post, B comments, C upvotes B's comment, and A destroys post" do
    old_points = @second_user.points
    comment_vote = Vote.create(votable: @second_comment, user_id: @third_user.id, polarity: 1)
    @second_user.reload
    assert_equal old_points + 1, @second_user.points
    @first_post.destroy
    assert_not Comment.exists?(@second_comment.id)
    @second_user.reload
    assert_equal old_points + 1, @second_user.points
  end
end
