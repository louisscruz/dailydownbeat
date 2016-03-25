require 'test_helper'

class PostTest < ActiveSupport::TestCase
  def setup
    @user = User.create(id: 1, username: "test", email: "test@me.com", password: "testtest", password_confirmation: "testtest")
    @post = Post.create(title: "test post", url: "http://www.test.com", user_id: 1)
    @user.reload
  end

  test "should be valid" do
    assert @post.valid?
  end

  test "title should be present" do
    @post.title = "    "
    assert_not @post.valid?
  end

  test "url should be present for non-ask posts" do
    @post.url = "    "
    assert_not @post.valid?
  end

  test "url should be blank for ask posts" do
    @ask_post = Post.create(title: "Testing", url: "http://test.com", user_id: 1, kind: "ask")
    assert_equal nil, @ask_post.url
  end

  test "url should be valid" do
    @post.url = "notvalid"
    assert_not @post.valid?
  end

  test "'ask' kind should always have blank url" do
    @ask_post = Post.create(title: "testing 123", user_id: 1, kind: "ask")
    #assert_equal "post"
  end

  test "kind should default to post" do
    assert_equal "post", @post.kind
  end

  test "title should not have prepend when regular kind of post" do
    @post.title = "ShOW dd: Something"
    assert_not @post.valid?
    @post.title = "JoB: Something"
    assert_not @post.valid?
    @post.title = "aSk Dd: something"
    assert_not @post.valid?
    @post.title = "checking: something"
    assert @post.valid?
  end

  test "title should be at least 3 chars" do
    @post.title = "a" * 2
    assert_not @post.valid?
    @post.title = "a" * 3
    assert @post.valid?
  end

  test "title should be limited to 80 chars" do
    @post.title = "a" * 81
    assert_not @post.valid?
    @post.title = "a" * 80
    assert @post.valid?
  end

  kind_hash = {"show" => "Show DD: ", "job" => "Job: ", "ask" => "Ask DD: "}
  kind_hash.each do |kind, prefix|
    test "title should have '#{prefix}' when kind is #{kind}" do
      @post.kind = kind
      @post.title = prefix + "testing"
      assert @post.valid?
      @post.title = "testing"
      assert_not @post.valid?
    end
  end

  test "create post should increment user points" do
    old_points = @user.points
    second_post = Post.create(title:"test", url: "http://www.test.com", user_id: 1)
    assert_equal old_points + 1, second_post.user.points
  end

  test "delete post should decrement user points" do
    old_points = @user.points
    @post.destroy
    assert_equal old_points - 1, @post.user.points
  end

  test "update post should not alter user points" do
    old_points = @user.points
    @post.update_attribute :title, "something new"
    @user.reload
    assert_equal old_points, @user.points
  end

  invalid_urls = ["i.n.v.a.l.i.d.", "www.valid.com", "test.com"]
  invalid_urls.each do |url|
    test "url of #{url} should be invalid" do
      @post.url = url
      assert_not @post.valid?
    end
  end
end
