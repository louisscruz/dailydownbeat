require 'test_helper'

class CommentTest < ActiveSupport::TestCase
  def setup
    FactoryGirl.create(:user)
    FactoryGirl.create(:post)
    @comment = Comment.create(commentable: Post.first, user_id: User.first.id, body: "testing")
  end

  test "should be valid" do
    assert @comment.valid?
  end

  test "should have a commentable" do
    @comment.commentable = nil
    assert_not @comment.valid?
  end

  test "should have a user id" do
    @comment.user_id = nil
    assert_not @comment.valid?
  end

  test "should only allow confirmed users to create comments on posts" do
    user = User.first
    user.update_attribute(:confirmed, false)
    user.reload
    comment = Comment.create(commentable: Post.first, user_id: user.id, body: "testing")
    assert_not comment.valid?
  end

  test "should only allow confirmed users to create comments on comments" do
    user = User.first
    user.update_attribute(:confirmed, false)
    user.reload
    comment = Comment.create(commentable: @comment, user_id: user.id, body: "testing")
    assert_not comment.valid?
  end

  test "should have a default comment_count of zero" do
    assert_equal 0, @comment.comment_count
  end

  test "should increment comment_count on immediate parent on create" do
    assert_equal 1, @comment.commentable.comment_count
  end

  test "should decrement comment_count on immediate parent on destroy" do
    @comment.destroy
    assert_equal 0, @comment.commentable.comment_count
  end

  test "should be commentable" do
    comment = Comment.create(commentable: @comment, user_id: User.first.id, body: "testing2")
    assert comment.valid?
  end

  test "should increment comment_count on top commentable on create" do
    assert_equal 1, @comment.commentable.comment_count
    Comment.create(commentable: @comment, user_id: User.first.id, body: "testing2")
    assert_equal 2, @comment.commentable.comment_count
  end

  test "should decrement comment_count on top commentable on destroy" do
    assert_equal 1, @comment.commentable.comment_count
    new_comment = Comment.create(commentable: @comment, user_id: User.first.id, body: "testing2")
    assert_equal 2, @comment.commentable.comment_count
    new_comment.destroy
    assert_equal 1, @comment.commentable.comment_count
  end
end
