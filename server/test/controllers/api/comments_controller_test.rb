require 'test_helper'

class Api::CommentsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = User.create(username: "testingtest", email: "a@b.com", password: "testtest", password_confirmation: "testtest", confirmed: true, points: 50)
    @admin_user = User.create(username: "johndoe2", email: "a@b2.com", password: "testtest", password_confirmation: "testtest", confirmed: true, admin: true, points: 50)
    @post = Post.create(title: "test post", user_id: @user.id, url: "http://www.google.com", created_at: Faker::Time.backward(1950, :all))
    @user_credentials = { email: @user.email, password: "testtest"}
    @admin_credentials = { email: @admin_user.email, password: "testtest" }
    post api_login_url, params: { session: @user_credentials }
    @user.reload
    @@user_headers = { "Authorization" => @user.auth_token }
  end

  test "should successfully save a valid comment on a post" do
    old_comment_count = @post.comments.count
    comment_params = { body: "test body", commentable_id: @post.id, commentable_type: "Post", user_id: @user.id }
    post "/api/comments", params: { comment: comment_params }, headers: { "Authorization" => @user.auth_token }
    assert_equal old_comment_count + 1, @post.comments.count
  end
end
