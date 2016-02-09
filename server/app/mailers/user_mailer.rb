class UserMailer < ApplicationMailer
  default from: ENV["OUTGOING_EMAIL"]

  def welcome(user)
    @user = user
    @url  = 'http://0.0.0.0:3000/login'
    mail(to: user.email,
         subject: 'Welcome to Daily Downbeat',
         template_path: 'user_mailer',
         template_name: 'welcome'
         )
  end

  def confirm(user)
    @user = user
    @url = "http://localhost:3000/api/users/" + @user.id.to_s + "/confirm/" + @user.confirmation_code
    mail(to: user.email,
         subject: "Daily Downbeat: Account Confirmation",
         template_path: "user_mailer",
         template_name: "confirm")
  end
end
