module SessionsHelper
  def create_session(user)
    session[:user_id] = user.id
  end

  def current_user
    p request.headers["Authorization"]
    auth_token = request.headers["Authorization"]
    if auth_token
      auth_token = auth_token.split(" ").last
    end
    #p User.find_by(auth_token: auth_token)
    @current_user ||= User.find_by(auth_token: auth_token)
  end

  def log_out(user)
    #p logged_in?
    logged_in? ? user.generate_authentication_token! : user.destroy_token!
    #user.generate_authentication_token!
    auth_token = user.auth_token
    user.update_attribute(:auth_token, auth_token)
  end

  def logged_in?
    current_user.present?
  end

  def authenticate_with_token!
    render json: { errors: "Not authenticated" }, status: :unauthorized unless logged_in?
  end

  def log_in(user)
    create_session(user)
    user.generate_authentication_token!
    user.update_attribute(:auth_token, user.auth_token)
  end
end
