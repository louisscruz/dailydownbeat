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

  test "should have a default comment_count of zero" do
    assert_equal 0, @comment.comment_count
  end

  test "should increment comment_count on create" do
    @comment.save
    assert_equal 1, @comment.commentable.comment_count
  end

  test "should decrement comment_count on destroy" do
    @comment.destroy
    assert_equal 0, @comment.commentable.comment_count
  end
end
