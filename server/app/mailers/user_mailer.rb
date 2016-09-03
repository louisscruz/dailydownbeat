class UserMailer < ApplicationMailer
  default from: ENV['OUTGOING_EMAIL']

  def welcome(user)
    @user = user
    @url = URLS_CONFIG['base_url'] + '/#/login'
    mail(to: user.email,
         subject: 'Welcome to Daily Downbeat',
         template_path: 'user_mailer',
         template_name: 'welcome'
         )
  end

  def confirm(user)
    @user = user
    @url = URLS_CONFIG['base_url'] + '/#/user/' + @user.username.to_s + '/confirm/' + @user.confirmation_code
    mail(to: user.email,
         subject: 'Daily Downbeat: Account Confirmation',
         template_path: 'user_mailer',
         template_name: 'confirm')
  end

  def changed_email(user, old_email)
    @user = user
    @old_email = old_email
    mail(to: [user.email, old_email],
         subject: 'Daily Downbeat: Email Address Changed',
         template_path: 'user_mailer',
         template_name: 'changed_email')
  end
end
