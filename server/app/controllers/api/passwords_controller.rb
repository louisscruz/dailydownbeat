class Api::PasswordsController < ApplicationController
  before_action :authenticate_as_self_or_admin!
  def update
    user = User.find(params[:id])
    if user.authenticate(params[:new_password])
      render json: @user, status: :unprocessable_entity
    elsif user.update_attributes(password: params[:new_password], password_confirmation: params[:new_password_confirmation])
      render json: @user
    else
      render json: @user, status: :unprocessable_entity
    end
  end
end
