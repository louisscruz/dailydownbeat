require 'test_helper'

class Api::PostsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = User.create(username: "testingtest", email: "a@b.com", password: "testtest", password_confirmation: "testtest", confirmed: true, points: 50)
    @admin_user = User.create(username: "johndoe2", email: "a@b2.com", password: "testtest", password_confirmation: "testtest", confirmed: true, admin: true, points: 50)
    44.times do |i|
      Post.create(id: i, title: "#{i} post", user_id: @user.id, url: "http://www.google.com", created_at: Faker::Time.backward(1950, :all))
    end
    @user_post = Post.create(id: Post.count + 1, title: "testing", user_id: @user.id, url: "http://www.test.com")
    @admin_post = Post.create(id: Post.count + 1, title: "testing", user_id: @admin_user.id, url: "http://www.test.com")
    @post_count = Post.count
    @per_page = 15
    @current_page = 2
    @last_page = (@post_count / @per_page.to_f).ceil
    @remainder = (@post_count % @per_page)
    @credentials = { email: @user.email, password: "testtest"}
    @admin_credentials = { email: @admin_user.email, password: "testtest" }
    post api_login_url, params: { session: @credentials }
  end

  # Get

  test "should default to first page" do
    get api_posts_url
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal body.length, 30
  end

  test "should return the correct number of posts" do
    get api_posts_url, params: { page: @current_page, per_page: @per_page }
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal @per_page, body.length
  end

  test "should return the correct number of posts when a remainder" do
    get api_posts_url, params: { page: @last_page, per_page: @per_page }
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal @remainder, body.length
  end

  # Post

  test "should succesfully post a valid post" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    post_params = { title: "new title", url: "http://www.google2.com" }
    put "/api/posts/" + @user_post.id.to_s, params: { post: post_params }, headers: { "Authorization" => @user.auth_token }
    returned_post = JSON.parse(response.body)
    assert_equal post_params[:title], returned_post["title"]
    assert_equal post_params[:url], returned_post["url"]
  end


  # Put

  test "should succesfully put a valid edit post by proper user" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    update_params = { title: "new title", url: "http://www.google2.com" }
    put "/api/posts/" + @user_post.id.to_s, params: { post: update_params }, headers: { "Authorization" => @user.auth_token }
    @user_post.reload
    assert_equal update_params[:title], @user_post.title
    assert_equal update_params[:url], @user_post.url
  end

  test "should succesfully put a valid edit post by admin user" do
    post api_login_url, params: { session: @credentials }
    @admin_user.reload
    update_params = { title: "new title", url: "http://www.google2.com" }
    put "/api/posts/" + @user_post.id.to_s, params: { post: update_params }, headers: { "Authorization" => @admin_user.auth_token }
    @user_post.reload
    assert_equal update_params[:title], @user_post.title
    assert_equal update_params[:url], @user_post.url
  end

  test "should not put a valid edit post by an improper user" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    update_params = { title: "new title", url: "http://www.google2.com" }
    put "/api/posts/" + @admin_post.id.to_s, params: { post: update_params }, headers: { "Authorization" => @user.auth_token }
    @admin_post.reload
    assert_response 401
  end

  test "should not put an invalid edit post by proper user" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    update_params = { title: "new title", url: "http" }
    put "/api/posts/" + @user_post.id.to_s, params: { post: update_params }, headers: { "Authorization" => @user.auth_token }
    @user_post.reload
    assert_response 422
  end

  # Delete

  test "should not allow a non-admin user to delete other peoples' posts" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    delete "/api/posts/" + @admin_post.id.to_s, headers: { "Authorization" => @user.auth_token }
    assert_response 401
  end

  test "should allow a non-admin user to delete his own posts" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    delete "/api/posts/" + @user_post.id.to_s, headers: { "Authorization" => @user.auth_token }
    assert_response 204
  end

  test "should allow an admin user to delete other peoples' posts" do
    post api_login_url, params: { session: @admin_credentials }
    @admin_user.reload
    delete "/api/posts/" + @user_post.id.to_s, headers: { "Authorization" => @admin_user.auth_token }
    assert_response 204
  end

  # Votes

  test "should successfully save a valid upvote" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    post "/api/posts/" + @admin_post.id.to_s + "/upvote", params: {}, headers: { "Authorization" => @user.auth_token }
    assert_response 200
    assert_equal 1, @admin_post.votes.count
  end

  test "should successfully save a valid downvote" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    post "/api/posts/" + @admin_post.id.to_s + "/downvote", headers: { "Authorization" => @user.auth_token }
    assert_response 200
    assert_equal 1, @admin_post.votes.count
  end

  test "should successfully destroy an upvote" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    post "/api/posts/" + @admin_post.id.to_s + "/upvote", headers: { "Authorization" => @user.auth_token }
    assert_response 200
    assert_equal 1, @admin_post.votes.count
    post "/api/posts/" + @admin_post.id.to_s + "/unvote", headers: { "Authorization" => @user.auth_token }
    assert_response 204
    assert_equal 0, @admin_post.votes.count
  end

  test "should successfully destroy a downvote" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    post "/api/posts/" + @admin_post.id.to_s + "/downvote", headers: { "Authorization" => @user.auth_token }
    assert_response 200
    assert_equal 1, @admin_post.votes.count
    post "/api/posts/" + @admin_post.id.to_s + "/unvote", headers: { "Authorization" => @user.auth_token }
    assert_response 204
    assert_equal 0, @admin_post.votes.count
  end
end
