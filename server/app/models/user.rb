require 'json_web_token'

class User < ApplicationRecord
  attr_reader :current_password

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
      self.auth_token = JsonWebToken.encode('id' => self.id, 'username' => self.username, 'email' => self.email, 'bio' => self.bio, 'confirmed' => self.confirmed, 'admin' => self.admin, 'points' => self.points)
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

  def update_with_password(user_params)
    current_password = user_params.delete(:current_password)
    user_params[:password] = current_password if user_params[:password].nil?

    if self.authenticate(current_password)
      self.update(user_params)
    else
      self.errors.add(:current_password, current_password.blank? ? :blank : :invalid)
      false
    end
  end
end
