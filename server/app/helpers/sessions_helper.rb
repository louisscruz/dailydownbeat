module SessionsHelper
  def create_session(user)
    session[:user_id] = user.id
  end

  def current_user
    auth_token = request.headers["Authorization"]
    if auth_token
      auth_token = auth_token.split(" ").last
    end
    @current_user ||= User.find_by(auth_token: auth_token)
  end

  def log_out(user)
    logged_in? ? user.generate_authentication_token! : user.destroy_token!
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

  def authenticate_as_self_or_admin!
    render json: { errors: "Not authorized" }, status: :unauthorized unless is_self? || is_admin?
  end

  def is_self?
    user = User.find(params[:id])
    auth_token = request.headers["Authorization"]
    auth_token = auth_token.split(" ").last if auth_token
    user.auth_token != auth_token
  end

  def is_admin?
    if logged_in? && current_user.authenticate(params[:password])
      current_user.admin
    end
  end
end
