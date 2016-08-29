require "test_helper"

class Api::UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = User.create(id: User.count + 1, username: "johndoe", email: "a@b.com", password: "testtest", password_confirmation: "testtest", confirmed: true, points: 50)
    @user2 = User.create(id: User.count + 1, username: "johndoe2", email: "a@b2.com", password: "testtest", password_confirmation: "testtest", confirmed: true, points: 50)
    @unconfirmed_user = User.create(id: User.count + 1, username: "johndoe3", email: "a@b3.com", password: "testtest", password_confirmation: "testtest", confirmation_code: SecureRandom.hex)
    @credentials = { email: @user.email, password: "testtest"}
    2.times do
      Post.create(title: "testing", url: "http://www.google.com", user_id: 1)
    end
    @post = Post.create(title: "testing", user_id: @user2.id, url: "http://www.test.com")
    @post2 = Post.create(title: "testing2", user_id: @user2.id, url: "http://www.test.com")
    @vote = Vote.create(votable: @post, user_id: @user.id, polarity: 1)
    @downvote = Vote.create(votable: @post2, user_id: @user.id, polarity: -1)
  end

  # Confirmations

  test "confirm method should set the user to confirmed" do
    assert_not @unconfirmed_user.confirmed
    post "/api/users/" + @unconfirmed_user.id.to_s + "/confirm/" + @unconfirmed_user.confirmation_code, params: { confirmation_code: @unconfirmed_user.confirmation_code }
    @unconfirmed_user.reload
    assert @unconfirmed_user.confirmed
  end

  test "confirm method should deny incorrect confirmation codes" do
    assert_not @unconfirmed_user.confirmed
    post "/api/users/" + @unconfirmed_user.id.to_s + "/confirm/incorrect_code", params: { confirmation_code: "incorrect_code" }
    @unconfirmed_user.reload
    assert_not @unconfirmed_user.confirmed
  end

  test "confirm method should not allow redundant requests" do
    assert_not @unconfirmed_user.confirmed
    post "/api/users/" + @unconfirmed_user.id.to_s + "/confirm/" + @unconfirmed_user.confirmation_code, params: { confirmation_code: @unconfirmed_user.confirmation_code }
    @unconfirmed_user.reload
    assert @unconfirmed_user.confirmed
    post "/api/users/" + @unconfirmed_user.id.to_s + "/confirm/" + @unconfirmed_user.confirmation_code, params: { confirmation_code: @unconfirmed_user.confirmation_code }
    assert_response 403
  end

  test "successful confirmation should result in successful login" do
    assert_not @unconfirmed_user.confirmed
    post "/api/users/" + @unconfirmed_user.id.to_s + "/confirm/" + @unconfirmed_user.confirmation_code, params: { confirmation_code: @unconfirmed_user.confirmation_code }
    assert_equal session[:user_id], @unconfirmed_user.id
  end

  test "successful confirmation should return a new/appropriate auth token" do
    assert_not @unconfirmed_user.confirmed
    old_auth = @unconfirmed_user.auth_token
    post "/api/users/" + @unconfirmed_user.id.to_s + "/confirm/" + @unconfirmed_user.confirmation_code, params: { confirmation_code: @unconfirmed_user.confirmation_code }
    @unconfirmed_user.reload
    assert_not_equal @unconfirmed_user.auth_token, old_auth
  end

  # Email

  test "updated email should result in need for reconfirmation" do
    assert @user.confirmed
    @user.email = "new@address.com"
    @user.save
    @user.reload
    assert_not @user.confirmed
  end

  test "invalid email validation should return invalid" do
    get "/api/address/validate", params: { email: @user.email }
    body = JSON.parse(response.body)
    assert_equal body["is_valid"], false
  end

  test "valid email validation should return valid" do
    get "/api/address/validate", params: { email: "newvalid@me.com" }
    body = JSON.parse(response.body)
    assert_equal body["is_valid"], true
  end

  # Votes

  test "should return correct upvotes" do
    get upvotes_api_user_url(@user)
    assert_response 200
    body = JSON.parse(response.body)
    assert_equal @post.id, body[0]["votable_id"]
  end

  test "should return correct downvotes" do
    get downvotes_api_user_url(@user)
    assert_response 200
    body = JSON.parse(response.body)
    assert_equal @post2.id, body[0]["votable_id"]
  end

  # Update Bio

  test "should update bio with valid input" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    new_bio = "This is my new bio."
    update_params = { bio: new_bio }
    patch "/api/users/" + @user.id.to_s, params: { user: update_params }, headers: { "Authorization" => @user.auth_token }
    @user.reload
    assert_response 200
    assert_equal @user.bio, new_bio
  end

  # Password

  test "should update password with valid input" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    password_params = { current_password: "testtest", password: "newpassword", password_confirmation: "newpassword" }
    patch "/api/users/" + @user.id.to_s + "/update_password", params: { user: password_params }, headers: { "Authorization" => @user.auth_token }
    @user.reload
    assert @user.authenticate("newpassword")
  end

  test "should not update password of the same value" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    password_params = { current_password: "testtest", password: "testtest", password_confirmation: "testtest" }
    patch "/api/users/" + @user.id.to_s + "/update_password", params: { user: password_params }, headers: { "Authorization" => @user.auth_token }
    assert_response 422
  end

  test "should not update password to invalid values" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    password_params = { current_password: "testtest", password: "testttt", password_confirmation: "testttt" }
    patch "/api/users/" + @user.id.to_s + "/update_password", params: { user: password_params }, headers: { "Authorization" => @user.auth_token }
    assert_response 422
  end

  test "should not update password if confirmation mismatch" do
    post api_login_url, params: { session: @credentials }
    @user.reload
    password_params = { current_password: "testtest", password: "newpassword", password_confirmation: "newpassword2" }
    patch "/api/users/" + @user.id.to_s + "/update_password", params: { user: password_params }, headers: { "Authorization" => @user.auth_token }
    assert_response 422
  end
end
