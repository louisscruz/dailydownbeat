require 'json_web_token'

class User < ApplicationRecord
  before_save { email.downcase! }
  before_create :generate_authentication_token!
  validates :username, presence: true, length: { maximum: 24 }, uniqueness: { case_sensitive: false }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
  validates :email, presence: true, length: { maximum: 255 }, format: { with: VALID_EMAIL_REGEX }, uniqueness: { case_sensitive: false }
  has_secure_password
  validates :password, presence: true, length: { minimum: 8 }
  validates :auth_token, uniqueness: true
  has_many :comments

  def generate_authentication_token!
    begin
      self.auth_token = JsonWebToken.encode('username' => self.username)
    end while self.class.exists?(auth_token: auth_token)
  end

  def destroy_token!
    self.auth_token = nil
  end
end
