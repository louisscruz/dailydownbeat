require 'json_web_token'

class User < ApplicationRecord
  before_save { email.downcase! }
  before_create :generate_authentication_token!
  before_update :reset_confirmed!, :if => :email_changed?
  has_secure_password
  has_many :posts
  has_many :comments
  has_many :votes
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
  validates :email, presence: true, length: { maximum: 255 }, format: { with: VALID_EMAIL_REGEX }, uniqueness: { case_sensitive: false }
  validates :username, presence: true, length: { maximum: 24 }, uniqueness: { case_sensitive: false }
  validates :password, presence: true, length: { minimum: 8 }
  validates :auth_token, uniqueness: true

  def generate_authentication_token!
    begin
      self.auth_token = JsonWebToken.encode('id' => self.id, 'username' => self.username, 'email' => self.email, 'bio' => self.bio, 'confirmed' => self.confirmed, 'admin' => self.admin)
    end while self.class.exists?(auth_token: auth_token)
  end

  def destroy_token!
    self.auth_token = nil
  end

  def reset_confirmed!
    self.confirmed = false
  end

  def upvotes
    self.votes.where(polarity: 1)
  end

  def downvotes
    self.votes.where(polarity: -1)
  end
end
