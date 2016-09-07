require 'json_web_token'

class User < ApplicationRecord
  cattr_reader :current_password

  after_create :set_vip_points
  before_save { email.downcase! }
  before_create :generate_authentication_token!
  before_update :reset_confirmed!, :if => :email_changed?
  has_secure_password
  has_many :posts
  has_many :comments
  has_many :votes
  validates :bio, length: { maximum: 5000 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
  validates :email, presence: true, length: { maximum: 255 }, format: { with: VALID_EMAIL_REGEX }, uniqueness: { case_sensitive: false }
  validates :password, presence: true, confirmation: true, length: { minimum: 8 }, allow_nil: true
  validates :username, presence: true, length: { maximum: 24 }, uniqueness: { case_sensitive: false }
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
    if user_params[:password] && self.authenticate(user_params[:password])
      self.errors.add(:password, :invalid)
      false
    elsif self.authenticate(current_password)
      user_params[:password] = current_password if user_params[:password].nil?
      self.update(user_params)
    else
      self.errors.add(:current_password, current_password.blank? ? :blank : :invalid)
      false
    end
  end

  def set_vip_points
    email_endings = {
      "juilliard.edu" => 25,
      "sfcm.edu" => 25
    }
    email_endings.each do |key, value|
      if self.email[(0 - key.length)..-1] == key
        self.points += value
      end
    end
  end
end
