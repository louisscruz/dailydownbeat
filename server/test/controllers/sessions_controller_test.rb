require 'test_helper'

class Api::SessionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = FactoryGirl.create :user
    @credentials = { email: @user.email, password: "testtest"}
  end

  test "should return the user record corresponding to the given credentials" do
    post api_login_url, params: { session: @credentials }
    old_user = @user
    @user.reload
    assert_equal @user, old_user
  end

  test "should return a json error when wrong credentials" do
    @credentials = { email: @user.email, password: "wrongpassword" }
    post api_login_url, params: { session: @credentials }
    assert_response 422
  end

  test "should log out" do
    post api_login_url, params: { session: @credentials }
    @request.headers["Authorization"] = @user.auth_token
    delete api_logout_url, headers: @request.headers
    assert_response :success
  end
end
