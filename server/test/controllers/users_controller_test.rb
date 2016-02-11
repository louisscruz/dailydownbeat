require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = FactoryGirl.create :user
  end

  test "confirm method should make the user confirmed" do
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
end
