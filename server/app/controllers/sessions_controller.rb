class SessionsController < ApplicationController
  def new
  end

  def create
    user_password = params[:session][:password]
    user_email = params[:session][:email]
    user = user_email.present? && User.find_by(email: user_email)

    if user && user.authenticate(params[:session][:password])
      log_in user
      user.generate_authentication_token!
      p user.auth_token

      user.update_attribute(:auth_token, user.auth_token)
      p user
      render json: user, status: :created
    else
      render json: user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    log_out
  end
end
