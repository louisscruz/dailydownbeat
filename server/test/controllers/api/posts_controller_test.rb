require 'test_helper'

class Api::PostsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = User.create(username: "testingtest", email: "a@b.com", password: "testtest", password_confirmation: "testtest", confirmed: true)
    @admin_user = User.create(username: "johndoe2", email: "a@b2.com", password: "testtest", password_confirmation: "testtest", confirmed: true, admin: true)
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

  test "should not allow a non-admin user to delete other peoples' posts" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    delete "/api/posts/" + @admin_post.id.to_s, headers: { "Authorization" => @user.auth_token }
    assert_response 401
  end

  test "should allow a non-admin user to delete his own posts" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    delete "/api/posts/" + @user.id.to_s, headers: { "Authorization" => @user.auth_token }
    assert_response 204
  end

  test "should allow an admin user to delete other peoples' posts" do
    post api_login_url, params: { session: @admin_credentials }
    @admin_user.reload
    delete "/api/posts/" + @user_post.id.to_s, headers: { "Authorization" => @admin_user.auth_token }
    assert_response 204
  end
end
