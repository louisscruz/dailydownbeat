class UserMailerPreview < ActionMailer::Preview
  def welcome
    UserMailer.welcome(User.first)
  end

  def confirm
    UserMailer.confirm(User.first)
  end
end
