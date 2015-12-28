class SessionsController < ApplicationController
  before_action :authenticate_with_token!, only: [:destroy]
  def new
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)

    if user && user.authenticate(params[:session][:password])
      log_in user
      user.generate_authentication_token!
      user.update_attribute(:auth_token, user.auth_token)
      render json: user, status: :created
    else
      render json: user.errors, status: :unprocessable_entity
    end
  end

  #def destroy
    #p request.headers["Authorization"]
    #og_out current_user
    #render status: 204
  #end

  def destroy
    log_out current_user
    render status: 204
  end
end
