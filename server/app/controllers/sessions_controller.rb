class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      log_in user
      #render json: @user, status: :created, location: @user
    else
      #render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
  end
end
