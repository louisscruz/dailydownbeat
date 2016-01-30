require 'test_helper'

class Api::PostsControllerTest < ActionDispatch::IntegrationTest
  def setup
    FactoryGirl.create(:user)
    FactoryGirl.create_list(:post, 44)
    @post_count = Post.count
    @per_page = 15
    @current_page = 2
    @last_page = (@post_count / @per_page.to_f).ceil
    @remainder = (@post_count % @per_page)
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
    assert_equal body.length, @per_page
  end

  test "should return the correct number of posts when a remainder" do
    get api_posts_url, params: { page: @last_page, per_page: @per_page }
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal body.length, @remainder
  end
end
