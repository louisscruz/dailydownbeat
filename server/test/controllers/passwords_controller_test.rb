require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = FactoryGirl.create :user
  end

  test "should update password with valid input" do
    patch "/api/users/" + @user.id.to_s + "/update_password", params: { password: "testtest", new_password: "newpassword", new_password_confirmation: "newpassword" }
    @user.reload
    assert @user.authenticate("newpassword")
  end

  test "should not update password of the same value" do
    patch "/api/users/" + @user.id.to_s + "/update_password", params: { password: "testtest", new_password: "testtest", new_password_confirmation: "testtest" }
    assert_response 422
  end

  test "should not update password to invalid values" do
    patch "/api/users/" + @user.id.to_s + "/update_password", params: { password: "testtest", new_password: "testttt", new_password_confirmation: "testttt" }
    assert_response 422
  end

  test "should not update password if confirmation mismatch" do
    patch "/api/users/" + @user.id.to_s + "/update_password", params: { password: "testtest", new_password: "newpassword", new_password_confirmation: "newpassword2" }
    assert_response 422
  end
end
