require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = FactoryGirl.create :user
  end

  test "confirm method should set the user to confirmed" do
    assert_not @user.confirmed
    post "/api/users/" + @user.id.to_s + "/confirm/" + @user.confirmation_code, params: { confirmation_code: @user.confirmation_code }
    @user.reload
    assert @user.confirmed
  end

  test "confirm method should deny incorrect confirmation codes" do
    assert_not @user.confirmed
    post "/api/users/" + @user.id.to_s + "/confirm/incorrect_code", params: { confirmation_code: "incorrect_code" }
    @user.reload
    assert_not @user.confirmed
  end

  test "confirm method should not allow redundant requests" do
    assert_not @user.confirmed
    post "/api/users/" + @user.id.to_s + "/confirm/" + @user.confirmation_code, params: { confirmation_code: @user.confirmation_code }
    @user.reload
    assert @user.confirmed
    post "/api/users/" + @user.id.to_s + "/confirm/" + @user.confirmation_code, params: { confirmation_code: @user.confirmation_code }
    assert_response 403
  end

  test "successful confirmation should result in successful login" do
    assert_not @user.confirmed
    post "/api/users/" + @user.id.to_s + "/confirm/" + @user.confirmation_code, params: { confirmation_code: @user.confirmation_code }
    assert_equal session[:user_id], @user.id
  end

  test "successful confirmation should return a new/appropriate auth token" do
    assert_not @user.confirmed
    old_auth = @user.auth_token
    post "/api/users/" + @user.id.to_s + "/confirm/" + @user.confirmation_code, params: { confirmation_code: @user.confirmation_code }
    @user.reload
    assert_not_equal @user.auth_token, old_auth
  end
end
