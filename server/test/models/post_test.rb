require 'test_helper'

class PostTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  def setup
    User.create(id: 1, username: "test", email: "test@me.com", password: "testtest", password_confirmation: "testtest")
    @post = Post.create(title: "test post", url: "http://www.test.com", user_id: 1)
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

  test "url should be valid" do
    @post.url = "notvalid"
    assert_not @post.valid?
  end

  test "title should not have prepend when regular type of post" do
    @post.title = "ShOW dd: Something"
    assert_not @post.valid?
    @post.title = "JoB: Something"
    assert_not @post.valid?
    @post.title = "aSk Dd: something"
    assert_not @post.valid?
    @post.title = "checking: something"
    assert @post.valid?
  end

  type_hash = {"show" => "Show DD: ", "job" => "Job: ", "ask" => "Ask DD: "}
  type_hash.each do |type, prefix|
    test "title should have '#{prefix}' when type is #{type}" do
      @post.type = type
      @post.title = prefix + "testing"
      assert @post.valid?
      @post.title = "testing"
      assert_not @post.valid?
    end
  end
end
