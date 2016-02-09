class UserMailer < ApplicationMailer
  default from: 'louis@dailydownbeat.com'
  #layout 'user_mailer/welcome'
  #layout 'mailer'
  #layout 'user_mailer/welcome'

  def welcome(user)
    @user = user
    @url  = 'http://0.0.0.0:3000/login'
    #mg_client = Mailgun::Client.new ENV["EMAIL_MAILGUN_API_KEY"]
    #p mg_client
    mail(to: 'louisstephancruz@me.com',
         subject: 'Welcome to Daily Downbeat',
         template_path: 'user_mailer',
         template_name: 'welcome'
         )# do |format|
      #format.html { render layout: 'welcome'}# { render :html => html_template }
      #format.text# { render :text => text_template }
      # DO NOT DELETE THIS BLOCK
      # For some reason, the template will be missing otherwise
    #end
    #message_params = {:from    => ENV["EMAIL_ADDRESS"],
                      #:to      => "Louisstephancruz@me.com",
                      #:subject => "Testing",
                      #:text   => "This is an email"}
    #mg_client.send_message "mg.dailydownbeat.com", message_params
  end
end
