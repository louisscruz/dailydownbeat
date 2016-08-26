require 'json_web_token'

module SessionsHelper
  def create_session(user)
    session[:user_id] = user.id
  end

  #current_user is taken by active_model_serializers
  def this_user
    auth_token = request.headers["Authorization"]
    if auth_token
      auth_token = auth_token.split(" ").last
      user = User.find_by(email: "test@woohoo.com")
      begin
        decoded_token = JsonWebToken.decode(auth_token)
      rescue JWT::ExpiredSignature
        return
      end
      @this_user ||= User.find_by(auth_token: auth_token)
    end
  end

  def log_out(user)
    logged_in? ? user.generate_authentication_token! : user.destroy_token!
    auth_token = user.auth_token
    user.update_attribute(:auth_token, auth_token)
  end

  def logged_in?
    this_user.present?
  end

  def authenticate_with_token!
    render json: { errors: "Not authenticated" }, status: :unauthorized unless logged_in?
  end

  def log_in(user)
    create_session(user)
    user.generate_authentication_token!
    user.update_attribute(:auth_token, user.auth_token)
  end

  def authenticate_as_self_or_admin!
    unless logged_in? && (is_self? || is_admin?)
      render json: { errors: "Not authorized" }, status: :unauthorized
    end
  end

  def is_self?
    uri = request.parameters["controller"]
    resource = uri.split("/")[1].chomp('s').camelize.constantize
    user = resource.find(params[:id]).user

    user.id == @this_user.id
  end

  def is_admin?
    @this_user.admin
  end
end
