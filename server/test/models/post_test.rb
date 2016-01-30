require 'test_helper'

class PostTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  def setup
    User.create(id: 1, username: "test", email: "test@me.com", password: "testtest", password_confirmation: "testtest")
    @post = Post.create(title: "test post", url: "test.com", user_id: 1)
  end

  test "should be valid" do
    assert @post.valid?
  end

  test "title should be present" do
    @post.title = "    "
    assert_not @post.valid?
  end

  test "url should be present" do
    @post.url = "    "
    assert_not @post.valid?
  end
end
