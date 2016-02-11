require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  def setup
    @user = User.new(username: "johndoe", email: "test@me.com", password: "foobar22", password_confirmation: "foobar22", auth_token: "test", confirmation_code: SecureRandom.hex )
  end

  test "should be valid" do
    assert @user.valid?
  end

  test "username should be present" do
    @user.username = "    "
    assert_not @user.valid?
  end

  test "email should be present" do
    @user.email = "   "
    assert_not @user.valid?
  end

  test "confirmed is automatically false" do
    @user.save
    assert_equal @user.confirmed, false
  end

  test "username should be less than 25 chars" do
    @user.username = "a" * 25
    assert_not @user.valid?
  end

  test "username should be unique" do
    duplicate_user = @user.dup
    duplicate_user.email = 'testagain@me.com'
    duplicate_user.username = @user.username.upcase
    @user.save
    assert_not duplicate_user.valid?
  end

  test "email should be less than 256 chars" do
    @user.email = "a" * 256
    assert_not @user.valid?
  end

  test "email validation should accept valid addresses" do
    valid_addresses = %w[user@example.com USER@foo.COM A_US-ER@foo.bar.org first.last@foo.jp alice+bob@baz.cn]
    valid_addresses.each do |valid_address|
      @user.email = valid_address
      assert @user.valid?, "#{valid_address.inspect} should be valid"
    end
  end

  test "email validation should reject invalid addresses" do
    invalid_addresses = %w[user@example,com user_at_foo.org user.name@example.foo.bar_baz.com foo@bar+baz.com foo@bar..com]
    invalid_addresses.each do |invalid_address|
      @user.email = invalid_address
      assert_not @user.valid?, "#{invalid_address.inspect} should be invalid"
    end
  end

  test "email addresses should be unique" do
    duplicate_user = @user.dup
    duplicate_user.username = "somethingelse"
    duplicate_user.email = @user.email.upcase
    @user.save
    assert_not duplicate_user.valid?
  end

  test "email addresses should be saved as lower-case" do
    mixed_case_email = "Foo@ExAMPle.CoM"
    @user.email = mixed_case_email
    @user.save
    assert_equal mixed_case_email.downcase, @user.reload.email
  end

  test "password should not be blank" do
    @user.password = @user.password_confirmation = " " * 8
    assert_not @user.valid?
  end

  test "password should be at least 8 chars" do
    @user.password = @user.password_confirmation = "a" * 7
    assert_not @user.valid?
  end

  test "auth_token should be an attribute" do
    assert @user.respond_to?(:auth_token)
  end

  test "auth_token should be unique" do
    duplicate_user = @user.dup
    @user.save
    assert_not duplicate_user.valid?
  end

  test "auth_token should be generated when already taken" do
    existing_user = FactoryGirl.create(:user, auth_token: "test")
    @user.send(:generate_authentication_token!)
    assert_not_equal @user.auth_token, existing_user.auth_token
  end

  test "confirmation should default to false" do
    assert_equal @user.confirmed, false
  end
end
