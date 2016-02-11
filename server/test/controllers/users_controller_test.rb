require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = FactoryGirl.create :user
  end

  test "confirm method should make the user confirmed" do
    p @user
  end
end
