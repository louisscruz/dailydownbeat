require 'test_helper'

class Api::CommentsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = User.create(username: "testingtest", email: "a@b.com", password: "testtest", password_confirmation: "testtest", confirmed: true, points: 50)
    @admin_user = User.create(username: "johndoe2", email: "a@b2.com", password: "testtest", password_confirmation: "testtest", confirmed: true, admin: true, points: 50)
    @post = Post.create(title: "test post", user_id: @user.id, url: "http://www.google.com", created_at: Faker::Time.backward(1950, :all))
    @user_comment = Comment.create(body: "This is the body.", commentable: @post, user: @user)
    @admin_comment = Comment.create(body: "This is the body2.", commentable: @post, user: @admin_user)
    @user_credentials = { email: @user.email, password: "testtest"}
    @admin_credentials = { email: @admin_user.email, password: "testtest" }
    post api_login_url, params: { session: @user_credentials }
    @user.reload
    @@user_headers = { "Authorization" => @user.auth_token }
  end

  # Post

  test "should successfully save a valid comment on a post" do
    old_comment_count = @post.comments.count
    comment_params = { body: "test body", commentable_id: @post.id, commentable_type: "Post", user_id: @user.id }
    post "/api/comments", params: { comment: comment_params }, headers: { "Authorization" => @user.auth_token }
    assert_equal old_comment_count + 1, @post.comments.count
  end

  # Put

  test "should succesfully put a valid edit comment by proper user" do
    post api_login_url, params: { session: @user_credentials }
    @user.reload
    comment_params = { body: "new title" }
    put "/api/comments/" + @user_comment.id.to_s, params: { comment: comment_params }, headers: { "Authorization" => @user.auth_token }
    @user_comment.reload
    assert_equal comment_params[:body], @user_comment.body
  end

  test "should succesfully put a valid edit comment by admin user" do
    post api_login_url, params: { session: @admin_credentials }
    @admin_user.reload
    comment_params = { body: "new title2" }
    put "/api/comments/" + @user_comment.id.to_s, params: { comment: comment_params }, headers: { "Authorization" => @admin_user.auth_token }
    @user_comment.reload
    assert_equal comment_params[:body], @user_comment.body
  end

  test "should not put a valid edit comment by an improper user" do
    post api_login_url, params: { session: @user_credentials }
    @user.reload
    comment_params = { body: "new title" }
    put "/api/comments/" + @admin_comment.id.to_s, params: { comment: comment_params }, headers: { "Authorization" => @user.auth_token }
    assert_response 401
  end

  test "should not put an invalid edit comment by proper user" do
    post api_login_url, params: { session: @user_credentials }
    @user.reload
    comment_params = { body: "test" }
    put "/api/comments/" + @user_comment.id.to_s, params: { comment: comment_params }, headers: { "Authorization" => @user.auth_token }
    assert_response 422
  end

  # Delete

  test "should not allow a non-admin user to delete other peoples' comments" do
    post api_login_url, params: { session: @user_credentials }
    @user.reload
    delete "/api/comments/" + @admin_comment.id.to_s, headers: { "Authorization" => @user.auth_token }
    assert_response 401
  end

  test "should allow a non-admin user to delete his own posts" do
    post api_login_url, params: { session: @user_credentials }
    @user.reload
    delete "/api/comments/" + @user_comment.id.to_s, headers: { "Authorization" => @user.auth_token }
    assert_response 204
  end

  test "should allow an admin user to delete other peoples' posts" do
    post api_login_url, params: { session: @admin_credentials }
    @admin_user.reload
    delete "/api/comments/" + @user_comment.id.to_s, headers: { "Authorization" => @admin_user.auth_token }
    assert_response 204
  end
end
