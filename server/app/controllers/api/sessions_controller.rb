class Api::SessionsController < ApplicationController
  before_action :authenticate_with_token!, only: [:destroy]
  
  def new
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)

    if user && user.authenticate(params[:session][:password])
      log_in user
      render json: user, status: :created
    else
      render json: user, status: :unprocessable_entity
    end
  end

  def destroy
    log_out this_user
    render status: 204
  end
end
