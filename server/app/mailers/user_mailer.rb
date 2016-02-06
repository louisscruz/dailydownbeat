class UserMailer < ApplicationMailer
  default from: 'louis@dailydownbeat.com'

  def welcome_email(user)
    @user = user
    @url  = 'http://0.0.0.0:3000/login'
    mail(to: 'louisstephancruz@me.com', subject: 'Welcome to Daily Downbeat')
  end
end
