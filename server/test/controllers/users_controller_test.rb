require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = FactoryGirl.create :user
    @credentials = { email: @user.email, password: "testtest"}
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

  test "updated email should result in need for reconfirmation" do
    assert_not @user.confirmed
    post "/api/users/" + @user.id.to_s + "/confirm/" + @user.confirmation_code, params: { confirmation_code: @user.confirmation_code }
    @user.reload
    assert @user.confirmed
    @user.email = "new@address.com"
    @user.save
    @user.reload
    assert_not @user.confirmed
  end

  test "should successfully update valid email" do
    old = @user.dup
    post '/api/login', params: { session: @credentials }
    @user.reload
    assert_not_equal old.auth_token, @user.auth_token
    @request.headers["Authorization"] = @user.auth_token
    put api_user_path(@user), params: { user: { id: @user.id, email: "new@me.com", password: "testtest" }}, headers: @request.headers
    assert_response 201
    assert_equal "new@me.com", User.find(@user.id).email
  end

  test "should not update invalid email" do
    post api_login_url, params: { session: @credentials }
    @request.headers["Authorization"] = @user.auth_token
    email = "foo@bar..com"
    put "/api/users/" + @user.id.to_s, params: { email: email, password: "testtest", password_confirmation: "testtest" }, headers: @request.headers
    assert_not_equal email, @user.email
  end
end
