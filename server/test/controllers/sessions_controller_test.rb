require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest

  test "should return the user record corresponding to the given credentials" do
    user = FactoryGirl.create :user
    credentials = { email: user.email, password: "foobar22" }
    post login_url, params: { session: credentials }
    old_user = user
    user.reload
    assert_equal user, old_user
  end

  test "should return a json error when wrong credentials" do
    user = FactoryGirl.create :user
    credentials = { email: user.email, password: "wrongpassword" }
    post login_url, params: { session: credentials }
    assert_response 422
  end

  test "should log out" do
    user = FactoryGirl.create :user
    credentials = { email: user.email, password: "foobar22" }
    post login_url, params: { session: credentials }
    #delete logout_url, params: {id: @user.auth_token}
    #print delete logout_path
    delete logout_path
    assert_response 204
  end
end
